import { Errors } from 'cs544-js-utils';

import { LibraryDao } from './library-dao.js';
import * as Lib from './library.js';

/** Note that errors are documented using the `code` option which must be
 *  returned (the `message` can be any suitable string which describes
 *  the error as specifically as possible).  Whenever possible, the
 *  error should also contain a `widget` option specifying the widget
 *  responsible for the error).
 *
 *  Note also that the underlying DAO should not normally require a
 *  sequential scan over all books or patrons.
 */


/************************ Main Implementation **************************/

export function makeLendingLibrary(dao: LibraryDao) {
  return new LendingLibrary(dao);
}

export class LendingLibrary {

  constructor(private readonly dao: LibraryDao) {
  }

  /** clear out underlying db */
  async clear() : Promise<Errors.Result<void>> {
    return this.dao.clear();
  }

  /** Add one-or-more copies of book represented by req to this library.
   *  If the book is already in the library and consistent with the book
   *  being added, then the nCopies of the book is simply updated by
   *  the nCopies of the object being added (default 1).
   *
   *  Errors:
   *    MISSING: one-or-more of the required fields is missing.
   *    BAD_TYPE: one-or-more fields have the incorrect type.
   *    BAD_REQ: other issues, like:
   *      "nCopies" or "pages" not a positive integer.
   *      "year" is not integer in range [1448, currentYear]
   *      "isbn" is not in ISBN-10 format of the form ddd-ddd-ddd-d
   *      "title" or "publisher" field is empty.
   *      "authors" array is empty or contains an empty author
   *      book is already in library but data in req is 
   *      inconsistent with the data already present.
   */
  async addBook(req: Record<string, any>): Promise<Errors.Result<Lib.XBook>> {
    const bookResult = Lib.validate<Lib.XBook>('addBook', req);
    if (!bookResult.isOk) {
      return bookResult;
    }
    const book = bookResult.val;
    try {
      const existingBook = await this.dao.findBook(book.isbn);
      if (existingBook) {
        const mismatchField = compareBook(existingBook, book);
        if (mismatchField) {
          return Errors.errResult(`inconsistent title data for book ${book.isbn}`, { code: 'BAD_REQ', widget: mismatchField });
        }

        const updatedCopies = (existingBook.nCopies || 0) + (book.nCopies || 1);
        await this.dao.updateBookCopies(book.isbn, updatedCopies);
        return Errors.okResult({ ...existingBook, nCopies: updatedCopies });
      } else {
        const newBook = {
          ...book,
          nCopies: book.nCopies || 1 // Ensure nCopies has a default of 1 if not provided
        };
        await this.dao.insertBook(newBook);
        return Errors.okResult(newBook);
      }
    } catch (error) {
      return Errors.errResult((error as Error).message, 'DB');
    }
  }

  /** Return all books whose authors and title fields contain all
   *  "words" in req.search, where a "word" is a max sequence of /\w/
   *  of length > 1.  Note that word matching must be case-insensitive,
   *  but can depend on any stemming rules of the underlying database.
   *  
   *  The req can optionally contain non-negative integer fields
   *  index (default 0) and count (default DEFAULT_COUNT).  The
   *  returned results are a slice of the sorted results from
   *  [index, index + count).  Note that this slicing *must* be
   *  performed by the database.
   *
   *  Returned books should be sorted in ascending order by title.
   *  If no books match the search criteria, then [] should be returned.
   *
   *  Errors:
   *    MISSING: search field is missing
   *    BAD_TYPE: search field is not a string or index/count are not numbers.
   *    BAD_REQ: no words in search, index/count not int or negative.
   */
  async findBooks(req: Record<string, any>)
    : Promise<Errors.Result<Lib.XBook[]>>
  {
    const validationResult = Lib.validate<Lib.Find>('findBooks', req);
    if (!validationResult.isOk) {
      return validationResult as Errors.ErrResult;
    }
    const { search, index = 0, count = 0 } = validationResult.val;
    const words = search.match(/\w+/g);
    const cleanedSearch = words.map(word => `"${word}"`).join(' ')
    const searchResults = await this.dao.findBooks(cleanedSearch, index, count);
    return Errors.okResult(searchResults);
  }


  /** Set up patron req.patronId to check out book req.isbn. 
   * 
   *  Errors:
   *    MISSING: patronId or isbn field is missing
   *    BAD_TYPE: patronId or isbn field is not a string.
   *    BAD_REQ: invalid isbn or error on business rule violation, like:
   *      isbn does not specify a book in the library
   *      no copies of the book are available for checkout
   *      patron already has a copy of the same book checked out
   */
  async checkoutBook(req: Record<string, any>) : Promise<Errors.Result<void>> {
    const validationResult = Lib.validate<Lib.Lend>('checkoutBook', req);
    if(!validationResult.isOk){
      return validationResult as Errors.ErrResult;
    }
    const {isbn, patronId} = req;
    const book = await this.dao.findBook(isbn);
    if (!book) {
      return Errors.errResult(`Unknown book ${isbn}`, { code: 'BAD_REQ', widget: 'isbn' });
    }
    const numBookCheckouts = await this.dao.getNumBookCheckouts(isbn);
    if(numBookCheckouts === book.nCopies){
      return Errors.errResult(`No copies of the book ${isbn} are available for checkout`, { code: 'BAD_REQ', widget: isbn });
    }
    const patronHasBook = await this.dao.checkPatronHasBook(isbn, patronId);
    if(patronHasBook){
      return Errors.errResult(`patron ${patronId} already has book ${isbn}`, { code: 'BAD_REQ', widget: isbn });  
    }
    await this.dao.checkoutBook(patronId, isbn);
    return Errors.VOID_RESULT;
  }

  /** Set up patron req.patronId to returns book req.isbn.
   *  
   *  Errors:
   *    MISSING: patronId or isbn field is missing
   *    BAD_TYPE: patronId or isbn field is not a string.
   *    BAD_REQ: invalid isbn or error on business rule violation like
   *    isbn does not specify a book in the library or there is
   *    no checkout of the book by patronId.
   */
  async returnBook(req: Record<string, any>) : Promise<Errors.Result<void>> {
    const validationResult = Lib.validate<Lib.Lend>('checkoutBook', req);
    if(!validationResult.isOk){
      return validationResult as Errors.ErrResult;
    }
    const {isbn, patronId} = req;
    const book = await this.dao.findBook(isbn);
    if (!book) {
      return Errors.errResult(`Unknown book ${isbn}`, { code: 'BAD_REQ', widget: isbn });
    }
    const patronHasBook = await this.dao.checkPatronHasBook(isbn, patronId);
    if(!patronHasBook){
      return Errors.errResult(`There is no checkout of book ${isbn} by patron ${patronId}`, { code: 'BAD_REQ', widget: isbn });  
    }
    await this.dao.returnBook(patronId, isbn);
    return Errors.VOID_RESULT;
  }

  //add class code as needed

}

// default count for find requests
const DEFAULT_COUNT = 5;

//add file level code as needed
  

/********************** Domain Utility Functions ***********************/

/** return a field where book0 and book1 differ; return undefined if
 *  there is no such field.
 */
function compareBook(book0: Lib.Book, book1: Lib.Book) : string|undefined {
  if (book0.title !== book1.title) return 'title';
  if (book0.authors.some((a, i) => a !== book1.authors[i])) return 'authors';
  if (book0.pages !== book1.pages) return 'pages';
  if (book0.year !== book1.year) return 'year';
  if (book0.publisher !== book1.publisher) return 'publisher';
}


