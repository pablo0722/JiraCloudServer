"use strict";
/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.e = exports.w = exports.i = exports.d = exports.dump = void 0;
const debug = false;
const info = true;
const warn = true;
const error = true;
/*****************************************************************************
 * GLOBAL VARIABLES
 *****************************************************************************/
let dump;
exports.dump = dump;
exports.dump = dump = {
    'd': (v) => d(Object.keys(v)[0] + ': ', Object.values(v)[0]),
    'i': (v) => i(Object.keys(v)[0] + ': ', Object.values(v)[0]),
    'w': (v) => w(Object.keys(v)[0] + ': ', Object.values(v)[0]),
    'e': (v) => e(Object.keys(v)[0] + ': ', Object.values(v)[0]),
};
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function d(...args) {
    if (debug) {
        let mainArguments;
        mainArguments = [].slice.call(args, 0);
        mainArguments.unshift('[DEBUG] ');
        console.log.apply(null, mainArguments);
    }
}
exports.d = d;
function i(...args) {
    if (info) {
        let mainArguments;
        mainArguments = [].slice.call(args, 0);
        mainArguments.unshift('[INFO]  ');
        console.info.apply(null, mainArguments);
    }
}
exports.i = i;
function w(...args) {
    if (warn) {
        let mainArguments;
        mainArguments = [].slice.call(args, 0);
        mainArguments.unshift('[WARN]  ');
        console.info.apply(null, mainArguments);
    }
}
exports.w = w;
function e(...args) {
    if (error) {
        let mainArguments;
        mainArguments = [].slice.call(args, 0);
        mainArguments.unshift('[ERROR] ');
        console.info.apply(null, mainArguments);
    }
}
exports.e = e;
