#!/usr/bin/env ts-node
"use strict";
/** *** IMPORTANT NOTE ***

ALL FUNCTIONS BELOW MUST BE IMPLEMENTED WITHOUT USING RECURSION OR **ANY**
DESTRUCTIVE OPERATIONS.

Some consequences:

  + *NO LOOPS* of any kind.

  + Only const declarations.

  + Use Array methods like .map() and .reduce() and Array.from({length:n})
    (to create an empty n-element array).

  + No destructive Array methods like .push() (use .concat() instead).

  + You may use destructive methods like .reverse() as long as you
    use it only for its return value and not for its side-effects (this is
    because ts-node does not allow the use of the newer non-destructive
    .toReversed()).

  + Use String methods like split().

  + Use RegExp methods.

More details are in the restriction part in the document.

When fully implemented, running this file should result in the attached LOG.

*/
Object.defineProperty(exports, "__esModule", { value: true });
// this file should be directly executable using ts-node without needing
// to compile it.  If you are in the directory containing this dir, you
// should be able to run it by simply typing ./hw1-sol.ts
var TODO = -1; //used for placeholder return value in initial assignment.
/** #1: "5-points"
 *  Returns strings with each element reversed.
 */
function revStrings(strings) {
    return strings.map(function (s) { return s.split('').reverse().join(''); });
}
if (true) {
    logTests('revStrings', [
        function () { return revStrings(['hello', 'world']); },
        function () { return revStrings(['madam', 'racecar']); },
        function () { return revStrings(['1234']); },
        function () { return revStrings([]); },
    ]);
}
/** #2: "5-points"
 #  Return all words in str which start with an uppercase letter A-Z.
 *  Note that for this exercise and subsequent exercises, a word is
 *  defined to be a maximal sequence of length > 1 containing
 *  consecutive \w characters.
 */
function getCapitalizedWords(str) {
    return (str.match(/\b[A-Z]\w+/g) || []);
}
if (true) {
    logTests('getCapitalizedWords', [
        function () { return getCapitalizedWords(' Hello, world'); },
        function () { return getCapitalizedWords(' A Big--Boy'); },
        function () { return getCapitalizedWords('A B C '); },
        function () { return getCapitalizedWords(''); },
    ]);
}
/** #3: "5-points"
 #  Return all words in str which start with are camel-cased.
 *  A word is defined to be camel-cased if an uppercase letter A-Z
 *  immediately follows a lower-case letter a-z.
 */
function getCamelCasedWords(str) {
    return str.match(/\b[a-z]+[A-Z]\w*/g) || [];
}
if (true) {
    logTests('getCamelCasedWords', [
        function () { return getCamelCasedWords(' Helloworld'); },
        function () { return getCamelCasedWords(' A BigBoy Barracuda--camelCased'); },
        function () { return getCamelCasedWords('A B C '); },
        function () { return getCamelCasedWords(''); },
    ]);
}
/** #4: "5-points"
 *  Given a positive integer n > 0, return the list
 *  [1, 2, ..., (n-1), n, (n-1), ..., 2, ].
 */
function upDown1n1(n) {
    var ascending = Array.from({ length: n }, function (_, i) { return i + 1; });
    var descending = ascending.slice(0, n - 1).reverse();
    return ascending.concat(descending);
}
if (true) {
    logTests('upDown1n1', [
        function () { return upDown1n1(3); },
        function () { return upDown1n1(5); },
        function () { return upDown1n1(1); },
    ]);
}
/** #5: "5-points"
 *  Given a list of distinct numbers, return true iff
 *  perms is a permutation of it.
 */
function isPermutation(list, perms) {
    return list.length === perms.length && list.slice().sort(function (a, b) { return a - b; }).join() === perms.slice().sort(function (a, b) { return a - b; }).join();
}
if (true) {
    logTests('isPermutation', [
        function () { return isPermutation([1, 3, 2], [1, 2, 3]); },
        function () { return isPermutation([2, 3, 4], [2, 3, 4]); },
        function () { return isPermutation([2, 3, 4], [2, 3, 1]); },
        function () { return isPermutation([2], [2]); },
        function () { return isPermutation([2, 1], [1, 2, 3]); },
        function () { return isPermutation([1], []); },
        function () { return isPermutation([], []); },
    ]);
}
/** #6: "5-points"
 *  Given a number x and an integer n >= 0, return x**n
 *  without using **.
 */
function pow(x, n) {
    return n === 0 ? 1 : new Array(n).fill(x).reduce(function (acc, curr) { return acc * curr; }, 1);
}
if (true) {
    logTests('pow', [
        function () { return pow(2, 5); },
        function () { return pow(-2, 3); },
        function () { return pow(-5, 5); },
        function () { return pow(-5, 0); },
    ]);
}
/** #7: "5-points"
 *  Return x ** x ** x ** ... ** x with h x's.
 *  (i.e. the tetration of x to height h; see
 *  <https://en.wikipedia.org/wiki/Tetration>
 */
// Hint: the JS ** operator is right associative
function tetrate(x, h) {
    return h === 0 ? 1 : Array.from({ length: h }, function () { return x; }).reduceRight(function (acc, curr) { return Math.pow(curr, acc); });
}
if (true) {
    logTests('tetrate', [
        function () { return tetrate(2, 4); },
        function () { return tetrate(2, 5); },
        function () { return tetrate(5, 2); },
    ]);
}
/** #8: "5-points"
 *  A number in an arbitrary integer base b is represented by
 *  a list of "b-digits" [ d_0, d_1, d_2, ... ] where each d_i < b
 *  and has weight b**i.
 *
 *  For example, the decimal number 123 is represented by
 *  list of digits [3, 2, 1]; the hexadecimal number 0xabc is represented
 *  by the list of "hexadecimal-digits" [12, 11, 10].
 *
 *  Return the value of the number represented by list bDigits using
 *  base b.
 */
function digitsNumberValueInBase(b, bDigits) {
    return bDigits.map(function (digit, index) { return digit * Math.pow(b, index); }).reduce(function (acc, curr) { return acc + curr; }, 0);
}
if (true) {
    logTests('digitsNumberValueInBase', [
        function () { return digitsNumberValueInBase(10, [3, 2, 1]); },
        function () { return digitsNumberValueInBase(10, [6, 5, 4, 3, 2, 1]); },
        function () { return digitsNumberValueInBase(8, [7, 7, 3]); },
        function () { return digitsNumberValueInBase(16, [3, 2, 1]); },
        function () { return digitsNumberValueInBase(2, [1, 0, 1, 0, 1, 0, 1, 0]); },
        function () { return digitsNumberValueInBase(60, [5, 12, 6]); },
        function () { return digitsNumberValueInBase(60, []); },
    ]);
}
/** #9: "5-points"
 *  If n is an integer, then JS allows n.toString(b) to return
 *  the string representation of n in base b, where 2 <= b <= 36.
 *  See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString>.
 *
 *  Return the value of string str in base b.
 */
// *Hint*: use charCodeAt() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt> 
function bStringValue(bString, b) {
    return TODO;
}
if (false) {
    logTests('bStringValue', [
        function () { return bStringValue("123", 10); },
        function () { return bStringValue("10101010", 2); },
        function () { return bStringValue("377", 8); },
        function () { return bStringValue("aAA", 16); },
        function () { return bStringValue("2h5", 20); },
    ]);
}
/** #10: "10-points"
 *  Given a list ls of 2n elements, return a n-element
 *  list of the consecutive pairs of ls.
 */
function listPairs(ls) {
    return []; //TODO
}
if (false) {
    logTests('listPairs', [
        function () { return listPairs([1, 2]); },
        function () { return listPairs([1, 2, 3, 4]); },
        function () { return listPairs([1, 2, 3, 4, 5, 6]); },
        function () { return listPairs(['a', 'b', 'c', 'd']); },
        function () { return listPairs([[1, 2], [3], [4], [5, 6]]); },
        function () { return listPairs([]); },
    ]);
}
/** #11: "5-points"
 *  Given a list ls of n*m elements, return a m-element
 *  list of the consecutive n-tuples of ls.
 */
// *Hint*: this is merely a generalization of the previous exercise
function nTuples(ls, n) {
    return []; //TODO
}
if (false) {
    logTests('nTuples', [
        function () { return nTuples([1, 2], 1); },
        function () { return nTuples([1, 2], 2); },
        function () { return nTuples([1, 2, 3, 4, 5, 6], 3); },
        function () { return nTuples(['a', 'b', 'c', 'd', 'e', 'f'], 3); },
        function () { return nTuples(['a', 'b', 'c', 'd', 'e', 'f', 'h', 'i'], 4); },
        function () { return nTuples([['a', 'b'], ['c'], ['d'], ['e'], ['f', 'h'], ['i']], 3); },
        function () { return nTuples([], 1); },
        function () { return nTuples([], 10); },
    ]);
}
/** #12: "10-points"
 *  Return the value of e approximated as the sum of 1/k! for
 *  k in 1, 2, 3, ..., n.
 *  See <https://en.wikipedia.org/wiki/E_(mathematical_constant)>
 */
function e(n) {
    return TODO;
}
if (false) {
    logTests('e', [
        function () { return e(6); },
    ]);
}
// RETAIN STUFF BELOW
// for external testing purposes
exports.default = {
    revStrings: revStrings,
    getCapitalizedWords: getCapitalizedWords,
    getCamelCasedWords: getCamelCasedWords,
    upDown1n1: upDown1n1,
    isPermutation: isPermutation,
    pow: pow,
    tetrate: tetrate,
    digitsNumberValueInBase: digitsNumberValueInBase,
    bStringValue: bStringValue,
    listPairs: listPairs,
    nTuples: nTuples,
    e: e
};
//log as though running in node repl
function logTests(fnName, fns) {
    console.log("***** ".concat(fnName, "() *****"));
    for (var _i = 0, fns_1 = fns; _i < fns_1.length; _i++) {
        var fn = fns_1[_i];
        console.log('>', fn.toString().replace(/^\W+/, ''));
        console.log(fn());
    }
    console.log();
}
