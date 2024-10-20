//will run the project DAO using an in-memory mongodb server
import { MemDao, makeMemDao } from './mem-dao.js';

import { LibraryDao, } from '../lib/library-dao.js';

import * as Lib from '../lib/library.js';

import { BOOKS, } from './test-data.js';

import { assert, expect } from 'chai';

describe('library DAO', () => {

  //mocha will run beforeEach() before each test to set up these variables
  let memDao : MemDao;
  let dao: LibraryDao;
  
  beforeEach(async function () {
    const daoResult = await makeMemDao();
    assert(daoResult.isOk === true);
    memDao = daoResult.val;
    dao = memDao.dao;
  });

  //mocha runs this after each test; we use this to clean up the DAO.
  afterEach(async function () {
    await memDao.tearDown();
  });

  //TODO: add test suites here as needed to test your DAO as you implement it
  //(your DAO is available as variable "dao").
  it('should checkout a book for a patron', async () => {
    const patronId = PATRONS[0];
    const isbn = ISBNS[0];  
    await dao.checkoutBook(patronId, isbn);
    // Check if the book is checked out to the patron
    const hasBook = await dao.checkPatronHasBook(isbn, patronId);
    expect(hasBook).to.be.true;
    // Check if the number of checkouts for the book increased
    const numCheckouts = await dao.getNumBookCheckouts(isbn);
    expect(numCheckouts).to.equal(1);
  });

  it('should return a book for a patron', async () => {
    const patronId = PATRONS[1];
    const isbn = ISBNS[1];  
    // First, checkout a book
    await dao.checkoutBook(patronId, isbn);
    // Then, return the book
    await dao.returnBook(patronId, isbn);
    // Verify the book is no longer checked out
    const hasBook = await dao.checkPatronHasBook(isbn, patronId);
    expect(hasBook).to.be.false;
    // Ensure the number of checkouts for the book is zero
    const numCheckouts = await dao.getNumBookCheckouts(isbn);
    expect(numCheckouts).to.equal(0);
  });

  it('should get the number of checkouts for a book', async () => {
    const isbn = ISBNS[2];
    // Checkout the book for multiple patrons
    await dao.checkoutBook(PATRONS[0], isbn);
    await dao.checkoutBook(PATRONS[2], isbn);
    // Verify the number of checkouts is correct
    const numCheckouts = await dao.getNumBookCheckouts(isbn);
    expect(numCheckouts).to.equal(2);
  });

  it('should check if a patron has a book checked out', async () => {
    const patronId = PATRONS[2]; 
    const isbn = ISBNS[0];
    await dao.checkoutBook(patronId, isbn);
    // Check if patron has the book checked out
    const hasBook = await dao.checkPatronHasBook(isbn, patronId);
    expect(hasBook).to.be.true;
    // Check for a different patron who didn't checkout the book
    const otherPatronHasBook = await dao.checkPatronHasBook(isbn, PATRONS[0]);
    expect(otherPatronHasBook).to.be.false;
  });

});


const PATRONS = [ 'joe', 'bill', 'sue', 'anne', 'karen' ];
const ISBNS = BOOKS.slice(0, 5).map(b => b.isbn);
//LENDS = ISBNS x PATRONS
const LENDS = ISBNS.reduce((acc, isbn) => 
  acc.concat(PATRONS.map(patronId => ({ isbn, patronId }))), []);

