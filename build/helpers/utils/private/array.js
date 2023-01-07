"use strict";
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = exports.reduce = void 0;
function reduce(obj, src) {
    let ret = [];
    obj.forEach(e1 => {
        let found = false;
        src.forEach(e2 => {
            if (e1 == e2) {
                found = true;
            }
        });
        if (!found) {
            ret.push(e1);
        }
    });
    return ret;
}
exports.reduce = reduce;
function unique(arr) {
    return [...new Set(arr)];
}
exports.unique = unique;
