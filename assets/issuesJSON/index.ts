/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

 import { log } from '../../helpers/utils/index.js';
 import { file, array } from '../../helpers/utils/index.js';





 /*****************************************************************************
  * DEFINITIONS
  *****************************************************************************/

type parsedIssue = {
    issueKey: string,
    summary: string
};





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function readCommon(): string[] {
    return file.readJSON('./assets/issuesJSON/private/commonIssues.json');
}

function readDirectAccess(): string[] {
    return file.readJSON('./assets/issuesJSON/private/directAccessIssues.json');
}

function writeDirectAccess(json: any): void {
    file.writeJSON('./assets/issuesJSON/private/directAccessIssues.json', json);
}

function extendDirectAccess(json: any): void {
    file.extendJSON('./assets/issuesJSON/private/directAccessIssues.json', json);
}

function parse(issueName: string): parsedIssue {
    let start: number = issueName.indexOf("<") + 1;
    let end: number = issueName.indexOf(">: ");
    let issueKey = issueName.substr(start, end-start);
    let summary = issueName.substr(end + 3);
    let issue: parsedIssue = {issueKey: issueKey, summary: summary};
    log.dump.d({issue});
    
    return issue;
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    readCommon,
    readDirectAccess,
    writeDirectAccess,
    extendDirectAccess,
    
    parse
};
