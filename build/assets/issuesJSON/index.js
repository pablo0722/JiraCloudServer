"use strict";
/*****************************************************************************
 * IMPORTS
 *****************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.extendDirectAccess = exports.writeDirectAccess = exports.readDirectAccess = exports.readCommon = void 0;
const index_1 = require("../../helpers/utils/index");
const index_2 = require("../../helpers/utils/index");
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function readCommon() {
    return index_2.file.readJSON('./assets/issuesJSON/private/commonIssues.json');
}
exports.readCommon = readCommon;
function readDirectAccess() {
    return index_2.file.readJSON('./assets/issuesJSON/private/directAccessIssues.json');
}
exports.readDirectAccess = readDirectAccess;
function writeDirectAccess(json) {
    index_2.file.writeJSON('./assets/issuesJSON/private/directAccessIssues.json', json);
}
exports.writeDirectAccess = writeDirectAccess;
function extendDirectAccess(json) {
    index_2.file.extendJSON('./assets/issuesJSON/private/directAccessIssues.json', json);
}
exports.extendDirectAccess = extendDirectAccess;
function parse(issueName) {
    let start = issueName.indexOf("<") + 1;
    let end = issueName.indexOf(">: ");
    let issueKey = issueName.substr(start, end - start);
    let summary = issueName.substr(end + 3);
    let issue = { issueKey: issueKey, summary: summary };
    index_1.log.dump.d({ issue });
    return issue;
}
exports.parse = parse;
