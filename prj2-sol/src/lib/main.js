"use strict";
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
exports.default = main;
var path_1 = require("path");
var cs544_node_utils_1 = require("cs544-node-utils");
var cs544_js_utils_1 = require("cs544-js-utils");
var lending_library_js_1 = require("./lending-library.js");
var library_dao_js_1 = require("./library-dao.js");
/*************************** Top-Level Code ****************************/
function main(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (args.length < 2) {
                        help();
                        process.exit(1);
                    }
                    return [4 /*yield*/, go(args[0], args[1], makeReq(args.slice(2)))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function go(mongoUrl, cmd, req) {
    return __awaiter(this, void 0, void 0, function () {
        var daoResult, dao, library, _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, library_dao_js_1.makeLibraryDao)(mongoUrl)];
                case 1:
                    daoResult = _h.sent();
                    if (!daoResult.isOk)
                        panic(daoResult);
                    dao = daoResult.val;
                    _h.label = 2;
                case 2:
                    _h.trys.push([2, , 17, 19]);
                    library = (0, lending_library_js_1.makeLendingLibrary)(dao);
                    _a = cmd;
                    switch (_a) {
                        case 'addBook': return [3 /*break*/, 3];
                        case 'checkoutBook': return [3 /*break*/, 5];
                        case 'clear': return [3 /*break*/, 7];
                        case 'findBooks': return [3 /*break*/, 9];
                        case 'loadPaths': return [3 /*break*/, 11];
                        case 'returnBook': return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 15];
                case 3:
                    _b = out;
                    return [4 /*yield*/, library.addBook(req)];
                case 4:
                    _b.apply(void 0, [_h.sent()]);
                    return [3 /*break*/, 16];
                case 5:
                    _c = out;
                    return [4 /*yield*/, library.checkoutBook(req)];
                case 6:
                    _c.apply(void 0, [_h.sent()]);
                    return [3 /*break*/, 16];
                case 7:
                    _d = out;
                    return [4 /*yield*/, library.clear()];
                case 8:
                    _d.apply(void 0, [_h.sent()]);
                    return [3 /*break*/, 16];
                case 9:
                    _e = out;
                    return [4 /*yield*/, library.findBooks(req)];
                case 10:
                    _e.apply(void 0, [_h.sent()]);
                    return [3 /*break*/, 16];
                case 11:
                    _f = out;
                    return [4 /*yield*/, load(library, req)];
                case 12:
                    _f.apply(void 0, [_h.sent()]);
                    return [3 /*break*/, 16];
                case 13:
                    _g = out;
                    return [4 /*yield*/, library.returnBook(req)];
                case 14:
                    _g.apply(void 0, [_h.sent()]);
                    return [3 /*break*/, 16];
                case 15:
                    help();
                    _h.label = 16;
                case 16: return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, dao.close()];
                case 18:
                    _h.sent();
                    return [7 /*endfinally*/];
                case 19: return [2 /*return*/];
            }
        });
    });
}
function load(library, req) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, path, readResult, books, _b, books_1, book, addResult;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, _a = Object.values(req);
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    path = _a[_i];
                    return [4 /*yield*/, (0, cs544_node_utils_1.readJson)(path)];
                case 2:
                    readResult = _c.sent();
                    if (!readResult.isOk)
                        return [2 /*return*/, readResult];
                    books = readResult.val;
                    _b = 0, books_1 = books;
                    _c.label = 3;
                case 3:
                    if (!(_b < books_1.length)) return [3 /*break*/, 6];
                    book = books_1[_b];
                    return [4 /*yield*/, library.addBook(book)];
                case 4:
                    addResult = _c.sent();
                    if (!addResult.isOk)
                        return [2 /*return*/, addResult];
                    _c.label = 5;
                case 5:
                    _b++;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, cs544_js_utils_1.Errors.VOID_RESULT];
            }
        });
    });
}
function help() {
    var msg = "\n    usage: ".concat(path_1.default.basename(process.argv[1]), " MONGO_URL CMD KEY=VALUE...\n    for CMD in addBook|clear|checkoutBook|findBooks|loadPaths|returnBook\n").trim();
    console.log(msg);
}
/******************************* Utilities *****************************/
function out(result) {
    if (!result.isOk) {
        errors(result);
    }
    else {
        if (result.val !== undefined)
            console.log(result.val);
    }
}
function makeReq(args) {
    var req = {};
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        var m = arg.match(/^(\w+)\=(.*)$/);
        if (!m) {
            panic(cs544_js_utils_1.Errors.errResult("arg ".concat(arg, " not of form \"key=value\""), 'BAD_ARG'));
        }
        var _a = [m[1], m[2]], key = _a[0], value = _a[1];
        if (/^\d+$/.test(value)) { //brittle assumption
            req[key] = Number(value);
        }
        else if (m = value.match(/^\[(.+)\]$/)) {
            req[key] = m[1].split(/\s*,\s*/);
        }
        else {
            req[key] = value;
        }
    }
    return req;
}
function errors(result) {
    if (result.isOk === true)
        return;
    for (var _i = 0, _a = result.errors; _i < _a.length; _i++) {
        var err = _a[_i];
        var msg = "".concat(err.options.code, ": ").concat(err.message);
        var opts = '';
        for (var _b = 0, _c = Object.entries(err.options); _b < _c.length; _b++) {
            var _d = _c[_b], k = _d[0], v = _d[1];
            if (k === 'code')
                continue;
            opts += "".concat(k, "=").concat(v);
        }
        if (opts.length > 0)
            msg += '; ' + opts;
        console.error(msg);
    }
}
function panic(result) {
    errors(result);
    process.exit(1);
}
