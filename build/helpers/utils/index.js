"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web = exports.array = exports.extend = exports.itoa = exports.date = exports.file = exports.log = void 0;
const log = __importStar(require("./private/log"));
exports.log = log;
const file = __importStar(require("./private/file"));
exports.file = file;
const date = __importStar(require("./private/date"));
exports.date = date;
const number_1 = require("./private/number");
Object.defineProperty(exports, "itoa", { enumerable: true, get: function () { return number_1.itoa; } });
const dictionary_1 = require("./private/dictionary");
Object.defineProperty(exports, "extend", { enumerable: true, get: function () { return dictionary_1.extend; } });
const array = __importStar(require("./private/array"));
exports.array = array;
const web = __importStar(require("./private/web"));
exports.web = web;
