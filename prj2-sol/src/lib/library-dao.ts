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
    private readonly bookCheckouts: mongo.Collection<{isbn: string; patronId: string}>,
    private readonly patronCheckouts: mongo.Collection<{patronId: string; isbn: string}>) {
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
      const bookCheckouts = db.collection<{ isbn: string; patronId: string}>('bookCheckouts');
      const patronCheckouts = db.collection<{ patronId: string; isbn: string}>('patronCheckouts');

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
      await this.books.deleteMany({});
      await this.bookCheckouts.deleteMany({});
      await this.patronCheckouts.deleteMany({});
      return Errors.VOID_RESULT;
    } catch (err) {
      return Errors.errResult((err as Error).message, 'DB');
    }
  }

  async findBook(isbn: string): Promise<Lib.XBook | null> {
      return await this.books.findOne({ isbn });
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

  async updateBookCopies(isbn: string, updatedCopies: number): Promise<void> {
      await this.books.updateOne(
        { isbn }, 
        { $set: { nCopies: updatedCopies } }
      );
  }

  async insertBook(book: Lib.XBook): Promise<void> {
    await this.books.insertOne(book);
  }

  async getNumBookCheckouts(isbn: string): Promise<number>{
    const numBookCheckouts = await this.bookCheckouts.countDocuments({isbn});
    return numBookCheckouts;
  }

  async checkPatronHasBook(isbn: string, patronId: string): Promise<boolean> {
    const bookCheckout = await this.bookCheckouts.findOne({ isbn, patronId });
    return !!bookCheckout;
  }

  async checkoutBook(patronId: string, isbn: string): Promise<void> {
    await this.bookCheckouts.insertOne({ isbn, patronId });
    await this.patronCheckouts.insertOne({ patronId, isbn });
  }

  async returnBook(patronId: string, isbn: string): Promise<void> {
    await this.bookCheckouts.deleteOne({ isbn, patronId });
    await this.patronCheckouts.deleteOne({ patronId, isbn });
  }
} //class LibDao


