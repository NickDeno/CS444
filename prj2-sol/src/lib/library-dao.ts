import * as mongo from 'mongodb';

import { Errors } from 'cs544-js-utils';

import * as Lib from './library.js';

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
    public readonly client: mongo.MongoClient,
    public readonly books: mongo.Collection<Lib.XBook>,) {
  }

  //static factory function; should do all async operations like
  //getting a connection and creating indexing.  Finally, it
  //should use the constructor to return an instance of this class.
  //returns error code DB on database errors.
  static async make(dbUrl: string) : Promise<Errors.Result<LibraryDao>> {
    try {
      // Establish a connection to the MongoDB server using promises
      const client = await new mongo.MongoClient(dbUrl, MONGO_OPTIONS).connect(); 
      // Get a reference to the database
      const db = client.db(); // You may specify the db name here if needed
      // Get the 'books' collection, typed with Book type
      const books = db.collection<Lib.XBook>('books');
      // Create text indexes on 'title' and 'authors' fields to support search
      await books.createIndex({ title: 'text', authors: 'text' });
      // Return a new LibraryDao instance with the connected client and collection
      return Errors.okResult(new LibraryDao(client, books));
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

} //class LibDao


