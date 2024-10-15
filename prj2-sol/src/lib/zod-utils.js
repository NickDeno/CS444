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
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodToResult = zodToResult;
var cs544_js_utils_1 = require("cs544-js-utils");
var zod_1 = require("zod");
/** Convert a zodResult to an Errors.Result.  Use issuesInfos[zodMsg]
 *  as the translation of zodMsg.  All missing field errors will
 *  get code `MISSING` and all bad type errors will get code `BAD_TYPE`.
 */
function zodToResult(zod, issueInfos) {
    if (issueInfos === void 0) { issueInfos = {}; }
    if (zod.success === true) {
        return cs544_js_utils_1.Errors.okResult(zod.data);
    }
    else {
        return zodErrorToResultError(zod.error, issueInfos);
    }
}
function zodErrorToResultError(zodError, issueInfos) {
    var errors = [];
    for (var _i = 0, _a = zodError.issues; _i < _a.length; _i++) {
        var zIssue = _a[_i];
        var err = void 0;
        var msg = zIssue.message;
        var issueInfo = issueInfos[msg];
        if (typeof issueInfo === 'function') {
            issueInfo = issueInfo(zIssue);
        }
        var message = (typeof issueInfo === 'object')
            ? issueInfo.message
            : (typeof issueInfo === 'string')
                ? issueInfo
                : issueMessage(zIssue);
        var options = (typeof issueInfo === 'object')
            ? issueOptions(zIssue, issueInfo.options)
            : issueOptions(zIssue);
        err = new cs544_js_utils_1.Errors.Err(message, options);
        errors.push(err);
    }
    return new cs544_js_utils_1.Errors.ErrResult(errors);
}
function issueMessage(zIssue) {
    var _a, _b;
    var message = zIssue.message;
    var path = (_a = zIssue.path) !== null && _a !== void 0 ? _a : [];
    var widget = ((_b = path.at(-1)) !== null && _b !== void 0 ? _b : '').toString();
    if (zIssue.code === zod_1.z.ZodIssueCode.invalid_type) {
        if (zIssue.received === 'undefined') {
            message = "".concat(widget, " is required").trim();
        }
        else {
            message = "".concat(widget, " must have type ").concat(zIssue.expected).trim();
        }
    }
    return message;
}
function issueOptions(zIssue, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var path = (_a = zIssue.path) !== null && _a !== void 0 ? _a : [];
    var widget = ((_b = path.at(-1)) !== null && _b !== void 0 ? _b : '').toString();
    var code = 'BAD_REQ';
    if (zIssue.code === zod_1.z.ZodIssueCode.invalid_type) {
        if (zIssue.received === 'undefined') {
            code = 'MISSING';
        }
        else {
            code = 'BAD_TYPE';
        }
    }
    return __assign(__assign({ code: code }, options), { path: path.join('|') });
}
