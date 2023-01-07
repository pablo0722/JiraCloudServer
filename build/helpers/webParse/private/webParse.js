"use strict";
/* To auth method to Jira see "Supply basic auth headers" in:
 *     https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/
 * get issues from a sprint:
 *     https://mirgor-engineering.atlassian.net/rest/agile/1.0/board/11/issue?maxResults=10&jql=sprint=123
 * get sprint info:
 *     https://mirgor-engineering.atlassian.net/rest/agile/1.0/sprint/123
 * get all sprints of a board:
 *     https://mirgor-engineering.atlassian.net/rest/agile/1.0/board/11/sprint?startAt=50
 *     https://mirgor-engineering.atlassian.net/rest/agile/1.0/board/5/sprint?startAt=50
 * Board 11 = FAMP Platform
 * Board 5  = FAMP VW
 *
 * get my previous issues:
 *     https://mirgor-engineering.atlassian.net/rest/agile/1.0/board/11/issue?maxResults=10&fields=sprint,closedSprints,customfield_10020,summary&jql=(sprint=123|sprint=131|sprint=135)%20and%20assignee=620bdfd1f97d180071738aa0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogWork = exports.setCredentialsFile = exports.setCredentials = exports.getAllOpenSprintIssues = exports.getAllMyIssues = exports.getMyOpenIssues = exports.getMySprintIssues = exports.getMyOpenSprintIssues = exports.getCredentials = void 0;
/*****************************************************************************
 * IMPORTS
 *****************************************************************************/
const index_1 = require("../../utils/index");
/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
const myAssignee = '620bdfd1f97d180071738aa0';
const commonFields = [
    'issuetype',
    'project',
    'resolution',
    'issuerestriction',
    'priority',
    'issuelinks',
    'assignee',
    'status',
    'components',
    'description',
    'summary'
];
/*****************************************************************************
 * GLOBAL VARIABLES
 *****************************************************************************/
let _credentials;
/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/
function jiraUrlGet(arg) {
    let apiUrl = 'https://mirgor-engineering.atlassian.net/rest/api/3/search';
    let request = apiUrl;
    let hasQuestion = false;
    let question = [];
    let hasJql = false;
    let jql = [];
    // Questions
    if (arg.limit) {
        hasQuestion = true;
        question.push(`maxResults=${arg.limit}`);
    }
    if (arg.fields != undefined) {
        if (arg.fields.length > 0) {
            question.push(`fields=${arg.fields.join(',')}`);
        }
        else {
            question.push(`fields=""`);
        }
    }
    else {
        if (arg.brief) {
            question.push(`fields=${commonFields.join(',')}`);
        }
    }
    // JQL
    if (arg.project) {
        let projects = [];
        arg.project.forEach(p => {
            projects.push(`${p}`);
        });
        hasQuestion = true;
        hasJql = true;
        jql.push(`(project=${projects.join('|project=')})`);
    }
    if (arg.assignee) {
        hasJql = true;
        hasQuestion = true;
        jql.push(`assignee=${arg.assignee}`);
    }
    if (arg.openIssue) {
        hasJql = true;
        hasQuestion = true;
        jql.push(`status=open`);
    }
    if (arg.currentSprint) {
        hasJql = true;
        hasQuestion = true;
        jql.push(`sprint IN openSprints()`);
    }
    if (hasQuestion) {
        if (hasJql) {
            question.push(`jql=${jql.join(' and ')}`);
        }
        request = `${request}?${question.join('&')}`;
    }
    return request;
}
function jiraUrlPost(issueName) {
    let apiUrl = 'https://mirgor-engineering.atlassian.net/rest/api/3/issue';
    let request = `${apiUrl}/${issueName}/worklog`;
    return request;
}
function encodeBase64(deencoded) {
    let b = Buffer.from(deencoded);
    return b.toString('base64');
}
async function getJiraFromUrl(url) {
    let ret = '';
    let credentials = getCredentials();
    let deencoded = `${credentials.email}:${credentials.api_key}`;
    let encoded = encodeBase64(deencoded);
    let headers = {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
    };
    ret = await index_1.web.getData(url, headers);
    return ret;
}
async function postJiraFromUrl(url, data) {
    let ret = '';
    let credentials = getCredentials();
    let deencoded = `${credentials.email}:${credentials.api_key}`;
    let encoded = encodeBase64(deencoded);
    ret = await index_1.web.postData(url, data, {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
    });
    return ret;
}
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function setCredentials(credentials) {
    _credentials = credentials;
}
exports.setCredentials = setCredentials;
function setCredentialsFile(credentials_path) {
    _credentials = index_1.file.readJSON(credentials_path).jira_credentials;
}
exports.setCredentialsFile = setCredentialsFile;
function getCredentials() {
    return _credentials;
}
exports.getCredentials = getCredentials;
async function getMyOpenSprintIssues() {
    let url = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT', 'FAMPQNTDEV'],
        fields: ['summary'],
        limit: 1000,
        // assignee: '620bdfd1f97d180071738aa0',
        // openIssue: true,
        // currentSprint: true
    });
    index_1.log.dump.d({ url });
    let response = JSON.parse(await getJiraFromUrl(url));
    index_1.file.writeJSON('./logs/MyOpenSprintIssues.json', response);
    let issues = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    return issues;
}
exports.getMyOpenSprintIssues = getMyOpenSprintIssues;
async function getMySprintIssues() {
    let url = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT'],
        fields: ['summary'],
        limit: 1000,
        assignee: '620bdfd1f97d180071738aa0',
        //openIssue: true,
        currentSprint: true
    });
    index_1.log.dump.d({ url });
    let response = JSON.parse(await getJiraFromUrl(url));
    index_1.file.writeJSON('./logs/MySprintIssues.json', response);
    let issues = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    return issues;
}
exports.getMySprintIssues = getMySprintIssues;
async function getMyOpenIssues() {
    let url = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT'],
        fields: ['summary'],
        limit: 1000,
        assignee: '620bdfd1f97d180071738aa0',
        openIssue: true,
        //currentSprint: true
    });
    index_1.log.dump.d({ url });
    let response = JSON.parse(await getJiraFromUrl(url));
    index_1.file.writeJSON('./logs/MyOpenIssues.json', response);
    let issues = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    return issues;
}
exports.getMyOpenIssues = getMyOpenIssues;
async function getAllMyIssues() {
    let url = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT'],
        fields: ['summary'],
        limit: 1000,
        assignee: '620bdfd1f97d180071738aa0',
        //openIssue: true,
        //currentSprint: true
    });
    index_1.log.dump.d({ url });
    let response = JSON.parse(await getJiraFromUrl(url));
    index_1.file.writeJSON('./logs/AllMyIssues.json', response);
    let issues = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    return issues;
}
exports.getAllMyIssues = getAllMyIssues;
async function getAllOpenSprintIssues() {
    let url = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT'],
        fields: ['summary'],
        limit: 1000,
        //assignee: '620bdfd1f97d180071738aa0',
        openIssue: true,
        currentSprint: true
    });
    index_1.log.dump.d({ url });
    let response = JSON.parse(await getJiraFromUrl(url));
    index_1.file.writeJSON('./logs/AllOpenSprintIssues.json', response);
    let issues = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    return issues;
}
exports.getAllOpenSprintIssues = getAllOpenSprintIssues;
async function postLogWork(issueName, day, hour, // in format hh:mm
comment, time // in minutes
) {
    let url = jiraUrlPost(issueName);
    index_1.log.dump.d({ url });
    let seconds;
    if (typeof time === 'string') {
        seconds = parseFloat(time) * 60 * 60;
    }
    else {
        seconds = time * 60 * 60;
    }
    let ret = await postJiraFromUrl(url, {
        "comment": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "text": comment,
                            "type": "text"
                        }
                    ]
                }
            ]
        },
        "started": `20${day.year}-${day.month}-${day.day}T${hour}:00.000-0300`,
        "timeSpentSeconds": seconds
    });
    index_1.log.i('~ Work logged correctly');
    return ret;
}
exports.postLogWork = postLogWork;
