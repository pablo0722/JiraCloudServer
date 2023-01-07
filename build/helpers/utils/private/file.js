"use strict";
/*****************************************************************************
 * IMPORTS
 *****************************************************************************/
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
exports.extendJSON = exports.writeJSON = exports.readJSON = void 0;
const fs = __importStar(require("fs"));
const dictionary_1 = require("./dictionary");
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function readJSON(filename) {
    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return data;
}
exports.readJSON = readJSON;
function writeJSON(filename, json) {
    json = JSON.stringify(json, null, 4);
    try {
        fs.unlinkSync(filename); // Remove file to truncate content
    }
    catch (_a) { }
    fs.writeFile(filename, json, (err) => {
        if (err)
            throw err;
        //console.log('complete');
    });
}
exports.writeJSON = writeJSON;
function extendJSON(filename, json) {
    fs.readFile(filename, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log('error: ', err);
            if (err.code == 'ENOENT') {
                writeJSON(filename, json);
            }
            else {
                console.log(err);
            }
            return;
        }
        else {
            let newObj;
            if (data) {
                let obj = JSON.parse(data);
                newObj = (0, dictionary_1.extend)(obj, json);
            }
            else {
                newObj = json;
            }
            writeJSON(filename, newObj);
        }
    });
}
exports.extendJSON = extendJSON;
