import { Vote, Votation, startVotationGetter, stopVotationGetter, getVotation, getCredentials, getMyOpenSprintIssues, getMySprintIssues, getMyOpenIssues, getAllMyIssues, getAllOpenSprintIssues, setCredentials, setCredentialsFile, postLogWork } from './private/webParse.js';


export {
    // TYPE
    Vote,
    Votation,

    // THREAD
    startVotationGetter,
    stopVotationGetter,

    // GET
    getVotation,
    getCredentials,
    getMyOpenSprintIssues,
    getMySprintIssues,
    getMyOpenIssues,
    getAllMyIssues,
    getAllOpenSprintIssues,

    // SET
    setCredentials,
    setCredentialsFile,
    
    // POST
    postLogWork,
};
