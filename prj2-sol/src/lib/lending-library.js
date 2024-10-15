"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LendingLibrary = void 0;
exports.makeLendingLibrary = makeLendingLibrary;
var cs544_js_utils_1 = require("cs544-js-utils");
var Lib = require("./library.js");
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
function makeLendingLibrary(dao) {
    return new LendingLibrary(dao);
}
var LendingLibrary = /** @class */ (function () {
    function LendingLibrary(dao) {
        this.dao = dao;
    }
    /** clear out underlying db */
    LendingLibrary.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, cs544_js_utils_1.Errors.errResult('TODO')];
            });
        });
    };
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
    LendingLibrary.prototype.addBook = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var bookResult, book, existingBook, mismatchField, updatedCopies, newBook, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bookResult = Lib.validate('addBook', req);
                        if (!bookResult.isOk) {
                            return [2 /*return*/, bookResult];
                        }
                        book = bookResult.val;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.dao.books.findOne({ isbn: book.isbn })];
                    case 2:
                        existingBook = _a.sent();
                        if (!existingBook) return [3 /*break*/, 4];
                        mismatchField = compareBook(existingBook, book);
                        if (mismatchField) {
                            // Content doesn't match, return an error
                            return [2 /*return*/, cs544_js_utils_1.Errors.errResult("Existing book differs in field: ".concat(mismatchField), 'BAD_REQ')];
                        }
                        updatedCopies = (existingBook.nCopies || 0) + (book.nCopies || 1);
                        return [4 /*yield*/, this.dao.books.updateOne({ isbn: book.isbn }, { $set: { nCopies: updatedCopies } })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, cs544_js_utils_1.Errors.okResult(__assign(__assign({}, existingBook), { nCopies: updatedCopies }))];
                    case 4:
                        newBook = __assign(__assign({}, book), { nCopies: book.nCopies || 1 // Ensure nCopies has a default of 1 if not provided
                         });
                        return [4 /*yield*/, this.dao.books.insertOne(newBook)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, cs544_js_utils_1.Errors.okResult(newBook)];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        return [2 /*return*/, cs544_js_utils_1.Errors.errResult(error_1.message, 'DB')];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
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
    LendingLibrary.prototype.findBooks = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, cs544_js_utils_1.Errors.errResult('TODO')];
            });
        });
    };
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
    LendingLibrary.prototype.checkoutBook = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, cs544_js_utils_1.Errors.errResult('TODO')];
            });
        });
    };
    /** Set up patron req.patronId to returns book req.isbn.
     *
     *  Errors:
     *    MISSING: patronId or isbn field is missing
     *    BAD_TYPE: patronId or isbn field is not a string.
     *    BAD_REQ: invalid isbn or error on business rule violation like
     *    isbn does not specify a book in the library or there is
     *    no checkout of the book by patronId.
     */
    LendingLibrary.prototype.returnBook = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, cs544_js_utils_1.Errors.errResult('TODO')];
            });
        });
    };
    return LendingLibrary;
}());
exports.LendingLibrary = LendingLibrary;
// default count for find requests
var DEFAULT_COUNT = 5;
//add file level code as needed
/********************** Domain Utility Functions ***********************/
/** return a field where book0 and book1 differ; return undefined if
 *  there is no such field.
 */
function compareBook(book0, book1) {
    if (book0.title !== book1.title)
        return 'title';
    if (book0.authors.some(function (a, i) { return a !== book1.authors[i]; }))
        return 'authors';
    if (book0.pages !== book1.pages)
        return 'pages';
    if (book0.year !== book1.year)
        return 'year';
    if (book0.publisher !== book1.publisher)
        return 'publisher';
}
