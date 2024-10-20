import * as mongo from 'mongodb';

import { Errors } from 'cs544-js-utils';

import * as Lib from './library.js';
import { boolean } from 'zod';

//TODO: define any DB specific types if necessary

export async function makeLibraryDao(dbUrl: string) {
  return await LibraryDao.make(dbUrl);
}

//options for new MongoClient()
const MONGO_OPTIONS = {
  ignoreUndefined: true,  //ignore undefined fields in queries
};


export class LibraryDao {

  //called by below static make() factory function with
  //parameters to be cached in this instance.
  constructor(
    private readonly client: mongo.MongoClient,
    private readonly books: mongo.Collection<Lib.XBook>,
    private readonly bookCheckouts: mongo.Collection<{isbn: string; patronIds: string[]}>,
    private readonly patronCheckouts: mongo.Collection<{patronId: string; isbns: string[]}>) {
  }

  //static factory function; should do all async operations like
  //getting a connection and creating indexing.  Finally, it
  //should use the constructor to return an instance of this class.
  //returns error code DB on database errors.
  static async make(dbUrl: string) : Promise<Errors.Result<LibraryDao>> {
    try {
      // Establish a connection to the MongoDB server using promises
      const client = await new mongo.MongoClient(dbUrl, MONGO_OPTIONS).connect(); 
      const db = client.db();

      const books = db.collection<Lib.XBook>('books');
      const bookCheckouts = db.collection<{ isbn: string; patronIds: string[] }>('bookCheckouts');
      const patronCheckouts = db.collection<{ patronId: string; isbns: string[] }>('patronCheckouts');

      await books.createIndex({ title: 'text', authors: 'text', isbn: 'text' });
      await bookCheckouts.createIndex({isbn: 'text'});
      await patronCheckouts.createIndex({patronId: 'text'});

      return Errors.okResult(new LibraryDao(client, books, bookCheckouts, patronCheckouts));
    } catch (error) {
      return Errors.errResult((error as Error).message, 'DB');
    }
  }

  /** close off this DAO; implementing object is invalid after 
   *  call to close() 
   *
   *  Error Codes: 
   *    DB: a database error was encountered.
   */
  async close() : Promise<Errors.Result<void>> {
    try {
      // Close the MongoDB client connection
      await this.client.close();
      return Errors.VOID_RESULT;
    } catch (err) {
      return Errors.errResult((err as Error).message, 'DB');
    }
  }

  /**
   * Clear out all documents in the 'books' collection.
   */
  async clear(): Promise<Errors.Result<void>> {
    try {
      await this.books.deleteMany({}); // Delete all books
      return Errors.VOID_RESULT;
    } catch (err) {
      return Errors.errResult((err as Error).message, 'DB');
    }
  }

  async findBook(isbn: string): Promise<Lib.XBook | null> {
      return await this.books.findOne({ isbn });
  }

  async updateBookCopies(isbn: string, updatedCopies: number): Promise<void> {
      // Perform the update operation
      await this.books.updateOne(
        { isbn }, 
        { $set: { nCopies: updatedCopies } }
      );
  }

  async insertBook(book: Lib.XBook): Promise<void> {
    // Perform the insert operation
    await this.books.insertOne(book);
  }

  async findBooks(search: string, index: number, count: number): Promise<Lib.XBook[]> {
    const booksCursor = await this.books.find(
      { $text: { $search: search } }, 
      { projection: { _id: 0 } }
    )
    .sort({ title: 1 })   // Sort by title
    .skip(index)          // Skip to the requested index
    .limit(count);        // Limit the number of results to 'count'
    const books = await booksCursor.toArray();
    return books;
  }

  async getNumBookCheckouts(isbn: string): Promise<number>{
    const bookCheckouts = await this.bookCheckouts.findOne({isbn});
    if(bookCheckouts){
      return bookCheckouts.patronIds.length;
    } else {
      this.bookCheckouts.insertOne({isbn: isbn, patronIds: []});
      return 0;
    }
  }
  async checkPatronHasBook(isbn: string, patronId: string): Promise<boolean> {
    const bookCheckouts = await this.bookCheckouts.findOne({ isbn });  
    if (!bookCheckouts) {
      return false;
    }
    const isCheckedOut = bookCheckouts.patronIds.includes(patronId);
    return isCheckedOut;
  }

  async checkoutBook(patronId: string, isbn: string): Promise<void> {
    await this.bookCheckouts.updateOne(
      { isbn: isbn },
      { $addToSet: { patronIds: patronId } },  
      { upsert: true }
    );
  
    await this.patronCheckouts.updateOne(
      { patronId: patronId },
      { $addToSet: { isbns: isbn } },  
      { upsert: true }
    );  
  }

  async returnBook(patronId: string, isbn: string): Promise<void> {
    await this.bookCheckouts.updateOne(
      { isbn: isbn },
      { $pull: { patronIds: patronId } }
    );

    await this.patronCheckouts.updateOne(
      { patronId: patronId },
      { $pull: { isbns: isbn } } 
    );
  }


} //class LibDao


