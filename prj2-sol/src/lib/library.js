"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
var cs544_js_utils_1 = require("cs544-js-utils");
var zod_utils_js_1 = require("./zod-utils.js");
var zod_1 = require("zod");
var GUTENBERG_YEAR = 1448;
var NOW_YEAR = new Date().getFullYear();
//specify key in zod validator to get value as message after
//passing through zodToResult()
var MSGS = {
    'msg.isbn': 'isbn must be of the form "ddd-ddd-ddd-d"',
    'msg.nonEmpty': 'must be non-empty',
    'msg.oneOrMoreAuthors': 'must have one or more authors',
    'msg.publishYear': "must be a past year on or after ".concat(GUTENBERG_YEAR),
};
// use zod to force Book to have the following fields:
//   isbn: a ISBN-10 string of the form ddd-ddd-ddd-d.
//   title: a non-empty string.
//   authors: a non-empty array of non-empty strings.
//   pages: a positive integer.
//   year: an integer within the range [GUTENBERG_YEAR, NOW_YEAR].
//   publisher: a non-empty string.
//   nCopies: an optional positive integer
var Book = zod_1.z.object({
    isbn: zod_1.z.string().regex(/^\d{3}-\d{3}-\d{3}-\d$/, { message: MSGS['msg.isbn'] }),
    title: zod_1.z.string().min(1, { message: MSGS['msg.nonEmpty'] }),
    authors: zod_1.z.array(zod_1.z.string().min(1, { message: MSGS['msg.nonEmpty'] })).min(1, { message: MSGS['msg.oneOrMoreAuthors'] }),
    pages: zod_1.z.number().int().positive(),
    year: zod_1.z.number().int().min(GUTENBERG_YEAR, { message: MSGS['msg.publishYear'] }).max(NOW_YEAR),
    publisher: zod_1.z.string().min(1, { message: MSGS['msg.nonEmpty'] }),
    nCopies: zod_1.z.number().int().positive().optional(),
});
var XBook = Book.required();
// use zod to force Find to have the following fields:
//   search: a string which contains at least one word of two-or-more \w.
//   index: an optional non-negative integer.
//   count: an optional non-negative integer.
var Find = zod_1.z.object({
    //search: z.string().min(2, { message: 'Search string must contain at least one word with two or more characters' }),
    search: zod_1.z.string().regex(/\b\w{2,}\b/, { message: 'Search string must contain at least one word with two or more alphanumeric characters' }),
    index: zod_1.z.number().int().nonnegative().optional(),
    count: zod_1.z.number().int().nonnegative().optional(),
});
// use zod to force Lend to have the following fields:
//   isbn: a ISBN-10 string of the form ddd-ddd-ddd-d.
//   patronId: a non-empty string.
var Lend = zod_1.z.object({
    isbn: zod_1.z.string().regex(/^\d{3}-\d{3}-\d{3}-\d$/, { message: MSGS['msg.isbn'] }),
    patronId: zod_1.z.string().min(1, { message: MSGS['msg.nonEmpty'] }),
});
var VALIDATORS = {
    addBook: Book,
    findBooks: Find,
    checkoutBook: Lend,
    returnBook: Lend,
};
function validate(command, req) {
    var validator = VALIDATORS[command];
    return (validator)
        ? (0, zod_utils_js_1.zodToResult)(validator.safeParse(req), MSGS)
        : cs544_js_utils_1.Errors.errResult("no validator for command ".concat(command));
}
