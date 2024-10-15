import { error } from 'console';
import { Errors } from 'cs544-js-utils';
import { isBigInt64Array } from 'util/types';

/** Note that errors are documented using the `code` option which must be
 *  returned (the `message` can be any suitable string which describes
 *  the error as specifically as possible).  Whenever possible, the
 *  error should also contain a `widget` option specifying the widget
 *  responsible for the error).
 *
 *  Note also that none of the function implementations should normally
 *  require a sequential scan over all books or patrons.
 */

/******************** Types for Validated Requests *********************/

/** used as an ID for a book */
type ISBN = string;

/** used as an ID for a library patron */
type PatronId = string;

export type Book = {
  isbn: ISBN;
  title: string;
  authors: string[];
  pages: number;      //must be int > 0
  year: number;       //must be int > 0
  publisher: string;
  nCopies?: number;   //# of copies owned by library; not affected by borrows;
  //must be int > 0; defaults to 1
};

export type XBook = Required<Book>;

type AddBookReq = Book;
type FindBooksReq = { search: string; };
type ReturnBookReq = { patronId: PatronId; isbn: ISBN; };
type CheckoutBookReq = { patronId: PatronId; isbn: ISBN; };

/************************ Main Implementation **************************/

export function makeLendingLibrary() {
  return new LendingLibrary();
}

export class LendingLibrary {
  //TODO: declare private TS properties for instance
  //Maps ISBN to XBook (books in the library)
  private books: Record<ISBN, XBook>;
  //Maps search words (from titles and authors) to ISBNs 
  private wordIndex: Record<string, ISBN[]>;
  // Tracks which patrons have checked out which books */
  private bookCheckouts: Record<ISBN, PatronId[]>;
  // Tracks which books are checked out by a specific patron
  private patronCheckouts: Record<PatronId, ISBN[]>;
  constructor() {
    //TODO: initialize private TS properties for instance
    this.books = {};
    this.wordIndex = {};
    this.bookCheckouts = {};
    this.patronCheckouts = {};
  }

  /** Add one-or-more copies of book represented by req to this library.
   *
   *  Errors:
   *    MISSING: one-or-more of the required fields is missing.
   *    BAD_TYPE: one-or-more fields have the incorrect type.
   *    BAD_REQ: other issues like nCopies not a positive integer 
   *             or book is already in library but data in obj is 
   *             inconsistent with the data already present.
   */
  addBook(req: Record<string, any>): Errors.Result<XBook> {
    const validateBook = this.validateBookRequest(req);
    if (!validateBook.isOk) {
      return validateBook;
    }
    const book: XBook = validateBook.val;

    if (book.isbn in this.books) {
      const existingBook = this.books[book.isbn];
      if (existingBook.title !== book.title) return Errors.errResult("inconsistent title data for book " + existingBook.isbn, "BAD_REQ")
      else if (existingBook.authors.join() !== book.authors.join()) return Errors.errResult("inconsistent authors data for book " + existingBook.isbn, "BAD_REQ")
      else if (existingBook.pages !== book.pages) return Errors.errResult("inconsistent pages data for book " + existingBook.isbn, "BAD_REQ")
      else if (existingBook.year !== book.year) return Errors.errResult("inconsistent year data for book " + existingBook.isbn, "BAD_REQ")
      else if (existingBook.publisher !== book.publisher) return Errors.errResult("inconsistent publisher data for book " + existingBook.isbn, "BAD_REQ")
      existingBook.nCopies += book.nCopies;
      //console.log(this.books);
      return Errors.okResult(existingBook);
    } else {
      this.books[book.isbn] = book;
      this.indexWords(book);
      //console.log(this.books);
      return Errors.okResult(book);
    }
  }

  /** Return all books matching (case-insensitive) all "words" in
   *  req.search, where a "word" is a max sequence of /\w/ of length > 1.
   *  Returned books should be sorted in ascending order by title.
   *
   *  Errors:
   *    MISSING: search field is missing
   *    BAD_TYPE: search field is not a string.
   *    BAD_REQ: no words in search
   */
  findBooks(req: Record<string, any>): Errors.Result<XBook[]> {
    const { search } = req;
    const errors: Errors.Err[] = [];
    if (!search) {
      errors.push(new Errors.Err('Property search is required', { code: 'MISSING', widget: 'search' }));
      return new Errors.ErrResult(errors);
    }
    const searchWords: string[] = this.extractWords(search);
    if (searchWords.length === 0) {
      errors.push(new Errors.Err('1 or more search words are required', { code: 'BAD_REQ', widget: 'search' }));
      return new Errors.ErrResult(errors);
    }

    let matchingISBNs: Set<ISBN> = new Set();
    searchWords.forEach((word, index) => {
      if (word in this.wordIndex) {
        const currISBNSet: Set<ISBN> = new Set(this.wordIndex[word]);
        if (index === 0) {
          matchingISBNs = currISBNSet;
        } else {
          matchingISBNs = intersection(matchingISBNs, currISBNSet);
        }
      } else {
        matchingISBNs.clear();
      }
    });

    if (matchingISBNs.size === 0) {
      return Errors.okResult([]);
    }
    const matchingBooks: XBook[] = [...matchingISBNs].map(isbn => this.books[isbn]);
    matchingBooks.sort((a, b) => a.title.localeCompare(b.title));
    return Errors.okResult(matchingBooks);
  }

  /** Set up patron req.patronId to check out book req.isbn. 
   * 
   *  Errors:
   *    MISSING: patronId or isbn field is missing
   *    BAD_TYPE: patronId or isbn field is not a string.
   *    BAD_REQ error on business rule violation.
   *  Notes:
   *    A patron may check out an unlimited number of distinct books from the library. It is
        necessary that the patron has fetched the physical books from the library stacks in order
        to check it out.
        A patron cannot check out a book not among the library's collections.
        A patron cannot check out a book all of whose copies have already been checked out by
        other patrons.  
   */
  checkoutBook(req: Record<string, any>): Errors.Result<void> {
    //console.log(this.bookCheckouts);
    //console.log(this.patronCheckouts);
    const { patronId, isbn } = req;
    const errors: Errors.Err[] = [];
    if (!patronId) {
      errors.push(new Errors.Err('Property patronId is required', { code: 'MISSING', widget: 'patronId' }));
    } else if (typeof patronId !== 'string') {
      errors.push(new Errors.Err('Property patronId must be a string', { code: 'BAD_TYPE', widget: 'patronId' }));
    }
    if (!isbn) {
      errors.push(new Errors.Err('Property isbn is required', { code: 'MISSING', widget: 'isbn' }));
    } else if (typeof isbn !== 'string') {
      errors.push(new Errors.Err('Property isbn must be a string', { code: 'BAD_TYPE', widget: 'isbn' }));
    }
    if (errors.length > 0) {
      return new Errors.ErrResult(errors);
    }

    const book = this.books[isbn];
    if (!book) {
      return Errors.errResult('Unknown book ' + isbn, { code: 'BAD_REQ', widget: 'isbn' });
    }
    //Book being checked out hasnt been checked out yet, create an entry in bookCheckouts for it
    if (!(isbn in this.bookCheckouts)) {
      this.bookCheckouts[isbn] = [];
    }
    else if (this.bookCheckouts[isbn].includes(patronId)) {
      return Errors.errResult('Patron ' + patronId + ' already has book ' + isbn, { code: 'BAD_REQ' });
    }
    if(this.bookCheckouts[isbn].length === book.nCopies){
      return Errors.errResult('No copies of book ' + isbn + ' are available for checkout', { code: 'BAD_REQ' });  
    }
    this.bookCheckouts[isbn].push(patronId);

    //Patron that is checking out hasnt checked a book out yet, create an entry in patronCheckouts for them
    if (!(patronId in this.patronCheckouts)) {
      this.patronCheckouts[patronId] = [];
    }
    this.patronCheckouts[patronId].push(isbn);
    //console.log(this.bookCheckouts);
    //console.log(this.patronCheckouts);
    return Errors.okResult(undefined);

  }

  /** Set up patron req.patronId to returns book req.isbn.
   *  
   *  Errors:
   *    MISSING: patronId or isbn field is missing
   *    BAD_TYPE: patronId or isbn field is not a string.
   *    BAD_REQ error on business rule violation.
   */
  returnBook(req: Record<string, any>): Errors.Result<void> {
    //console.log(this.bookCheckouts);
    //console.log(this.patronCheckouts);
    const { patronId, isbn } = req;
    const errors: Errors.Err[] = [];
    if (!patronId) {
      errors.push(new Errors.Err('Property patronId is required', { code: 'MISSING', widget: 'patronId' }));
    } else if (typeof patronId !== 'string') {
      errors.push(new Errors.Err('Property patronId must be a string', { code: 'BAD_TYPE', widget: 'patronId' }));
    }
    if (!isbn) {
      errors.push(new Errors.Err('Property isbn is required', { code: 'MISSING', widget: 'isbn' }));
    } else if (typeof isbn !== 'string') {
      errors.push(new Errors.Err('Property isbn must be a string', { code: 'BAD_TYPE', widget: 'isbn' }));
    }
    if (errors.length > 0) {
      return new Errors.ErrResult(errors);
    }

    // Check if the book exists in the library
    if (!(isbn in this.books)) {
      return Errors.errResult('Book ' + isbn + ' does not exist in the library', 'BAD_REQ');
    }
    // Check if the book has been checked out by the patron
    if (!(isbn in this.bookCheckouts) || !this.bookCheckouts[isbn].includes(patronId)) {
      return Errors.errResult('No checkout of book ' + isbn + ' by patron ' + patronId, 'BAD_REQ');
    }

    this.bookCheckouts[isbn] = this.bookCheckouts[isbn].filter(id => id !== patronId);
    if(this.bookCheckouts[isbn].length === 0){
      delete this.bookCheckouts[isbn];
    }
    this.patronCheckouts[patronId]= this.patronCheckouts[patronId].filter(id => id !== isbn);
    if(this.patronCheckouts[patronId].length === 0){
      delete this.patronCheckouts[patronId];
    }
    //console.log(this.bookCheckouts);
    //console.log(this.patronCheckouts);
    return Errors.okResult(undefined);
  }

  private validateBookRequest(req: Record<string, any>): Errors.Result<XBook> {
    const { isbn, title, authors, pages, year, publisher, nCopies } = req;
    const errors: Errors.Err[] = [];
    const requiredFields = [
      { field: 'isbn', label: 'Property isbn is required' },
      { field: 'title', label: 'Property title is required' },
      { field: 'authors', label: 'Property authors is required' },
      { field: 'pages', label: 'Property pages is required' },
      { field: 'year', label: 'Property year is required' },
      { field: 'publisher', label: 'Property publisher is required' },
    ];
    requiredFields.forEach(({ field, label }) => {
      if (!req[field]) {
        errors.push(new Errors.Err(label, { code: 'MISSING', widget: field }));
      }
    });
    if (errors.length > 0) {
      return new Errors.ErrResult(errors);
    }

    if (typeof isbn !== 'string') errors.push(new Errors.Err('Property isbn must be a string', { code: 'BAD_TYPE', widget: 'isbn' }));
    if (typeof title !== 'string') errors.push(new Errors.Err('Property title must be a string', { code: 'BAD_TYPE', widget: 'title' }));
    if (typeof publisher !== 'string') errors.push(new Errors.Err('Property publisher must be a string', { code: 'BAD_TYPE', widget: 'publisher' }));
    if (!Array.isArray(authors)) {
      errors.push(new Errors.Err('Property authors must have type string[]', { code: 'BAD_TYPE', widget: 'authors' }));
    } else {
      const authorArray = authors as string[];
      if (authorArray.length === 0) {
        errors.push(new Errors.Err('Property authors must be a non-empty string[]', { code: 'BAD_TYPE', widget: 'authors' }));
      }
      authorArray.forEach((author: any) => {
        if (typeof author !== 'string') {
          errors.push(new Errors.Err('Property authors must only contain strings', { code: 'BAD_TYPE', widget: 'authors' }));
        }
      });
    }
    if (typeof pages !== 'number' || !Number.isInteger(pages)) {
      errors.push(new Errors.Err('Property pages must be numeric', { code: 'BAD_TYPE', widget: 'pages' }));
    } else {
      if (pages <= 0) {
        errors.push(new Errors.Err('Property pages must be a number > 0', { code: 'BAD_TYPE', widget: 'pages' }));
      }
    }
    if (typeof year !== 'number' || !Number.isInteger(year)) {
      errors.push(new Errors.Err('Property year must be numeric', { code: 'BAD_TYPE', widget: 'year' }));
    } else {
      if (year <= 0) {
        errors.push(new Errors.Err('Property year must be a number > 0', { code: 'BAD_TYPE', widget: 'year' }));
      }
    }
    if (nCopies !== undefined) {
      if (nCopies <= 0) {
        errors.push(new Errors.Err('Property nCopies must be a number > 0', { code: 'BAD_REQ', widget: 'nCopies' }));
      }
      if (typeof nCopies != 'number') {
        errors.push(new Errors.Err('Property nCopies must be a number', { code: 'BAD_TYPE', widget: 'nCopies' }));
      } else {
        if (!Number.isInteger(nCopies)) {
          errors.push(new Errors.Err('Property nCopies must be an integer', { code: 'BAD_REQ', widget: 'nCopies' }));
        }
      }
    }

    if (errors.length > 0) {
      return new Errors.ErrResult(errors);
    }

    const numCopies = nCopies === undefined ? 1 : nCopies;
    return Errors.okResult({
      isbn,
      title,
      authors,
      pages,
      year,
      publisher,
      nCopies: numCopies,
    });
  }

  private indexWords(book: XBook): void {
    const words: Set<string> = new Set(this.extractWords(book.title).concat(...book.authors.map(this.extractWords)));

    words.forEach(word => {
      // Check if the word is already in the wordIndex
      if (!this.wordIndex[word]) {
        this.wordIndex[word] = [];  // Initialize with an empty array
      }

      // Add the ISBN to the array if it doesn't already exist
      if (!this.wordIndex[word].includes(book.isbn)) {
        this.wordIndex[word].push(book.isbn);
      }
    });
  }

  private extractWords(text: string): string[] {
    // Extract words (sequences of /\w/ of length > 1)
    return text.match(/\w{2,}/g)?.map(word => word.toLowerCase()) || [];
  }
}


/********************** Domain Utility Functions ***********************/
//TODO: add domain-specific utility functions or classes.

/********************* General Utility Functions ***********************/
export function intersection(setA: Set<ISBN>, setB: Set<ISBN>): Set<ISBN> {
  const resultSet = new Set<ISBN>();
  for (let item of setA) {
    if (setB.has(item)) {
      resultSet.add(item);
    }
  }
  return resultSet;
}

//TODO: add general utility functions or classes.

