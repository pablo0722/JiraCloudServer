"use strict";
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.itoa = void 0;
function itoa(n, digits) {
    return n.toLocaleString('en-US', { minimumIntegerDigits: digits, useGrouping: false });
}
exports.itoa = itoa;
