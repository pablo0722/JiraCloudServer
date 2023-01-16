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

/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import { date, file, log, web } from '../../utils/index.js'
import { storage } from '../../utilsh/index.js'





/*****************************************************************************
 * DEFINITIONS
 *****************************************************************************/

 type IssueResponseElement = {
    expand: string,
    self: string,
    id: string,
    key: string,
    name: string,
    avatarUrls: {
        '48x48': string,
        '24x24': string,
        '16x16': string,
        '32x32': string
    },
    projectCategory: {
        self: string,
        id: string,
        name: string,
        description: string
    },
    projectTypeKey: string,
    simplified: boolean,
    style: string,
    isPrivate: boolean,
    properties: {},
    fields: {
        issuetype: {
            self: string,
            id: string,
            description: string,
            iconUrl: string,
            name: string,
            subtask: boolean,
            avatarId: number,
            hierarchyLevel: number
        },
        project: {
            self: string,
            id: string,
            key: string,
            name: string,
            projectTypeKey: string,
            simplified: boolean,
            avatarUrls: {
                "48x48": string,
                "24x24": string,
                "16x16": string,
                "32x32": string
            },
            projectCategory: {
                self: string,
                id: string,
                description: string,
                name: string
            }
        },
        resolution: {
            self: string,
            id: string,
            description: string,
            name: string
        },
        issuerestriction: {
            issuerestrictions: {},
            shouldDisplay: boolean
        },
        priority: {
            self: string,
            iconUrl: string,
            name: string,
            id: string
        },
        issuelinks: [],
        assignee: {
            self: string,
            accountId: string,
            emailAddress: string,
            avatarUrls: {
                "48x48": string,
                "24x24": string,
                "16x16": string,
                "32x32": string
            },
            displayName: string,
            active: true,
            timeZone: string,
            accountType: string
        },
        status: {
            self: string,
            description: string,
            iconUrl: string,
            name: string,
            id: string,
            statusCategory: {
                self: string,
                id: number,
                key: string,
                colorName: string,
                name: string
            }
        },
        components: [],
        description: string,
        summary: string,
    }
};

type IssuesResponse = {
    expand: string,
    startAt: number,
    maxResults: number,
    total: number,
    issues: IssueResponseElement[];
};

type urlOptions = {
    project?: string[],
    fields?: (
        'issuetype'|
        'project'|
        'resolution'|
        'issuerestriction'|
        'priority'|
        'issuelinks'|
        'assignee'|
        'status'|
        'components'|
        'description'|
        'summary'
        )[],
    brief?: boolean,
    limit?: number,
    assignee?: string,
    openIssue?: boolean
    currentSprint?: boolean
};

type JiraCredentials = {
    email: string,
    api_key: string
};

type Vote = "XS" | "S" | "M" | "L" | "XL";

type Votation = {
    [key: string]: Vote;
};





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

let _credentials: JiraCredentials;
let _votation_running: boolean = false;





/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/

function jiraUrlGet(arg: urlOptions): string {
    let apiUrl = 'https://mirgor-engineering.atlassian.net/rest/api/3/search';
    let request = apiUrl;
    let hasQuestion = false;
    let question: string[] = [];
    let hasJql = false;
    let jql: string[] = [];
    
    // Questions
    if(arg.limit) {
        hasQuestion = true;
        question.push(`maxResults=${arg.limit}`);
    }
    if(arg.fields != undefined) {
        if(arg.fields.length > 0) {
            question.push(`fields=${arg.fields.join(',')}`);
        } else {
            question.push(`fields=""`);
        }
    } else {
        if(arg.brief) {
            question.push(`fields=${commonFields.join(',')}`);
        }
    }
    
    // JQL
    if(arg.project) {
        let projects: string[] = [];
        arg.project.forEach(p => {
            projects.push(`${p}`);
        })
        hasQuestion = true;
        hasJql = true;
        jql.push(`(project=${projects.join('|project=')})`);
    }
    if(arg.assignee) {
        hasJql = true;
        hasQuestion = true;
        jql.push(`assignee=${arg.assignee}`);
    }
    if(arg.openIssue) {
        hasJql = true;
        hasQuestion = true;
        jql.push(`status=open`);
    }
    if(arg.currentSprint) {
        hasJql = true;
        hasQuestion = true;
        jql.push(`sprint IN openSprints()`);
    }
    
    if(hasQuestion) {
        if(hasJql) {
            question.push(`jql=${jql.join(' and ')}`);
        }
        request = `${request}?${question.join('&')}`;
    }
    
    return request;
}

function jiraUrlPostWorklog(issueName: string): string {
    let apiUrl = 'https://mirgor-engineering.atlassian.net/rest/api/3/issue';
    let request = `${apiUrl}/${issueName}/worklog`
    
    return request;
}

function jiraUrlPostComment(issueName: string): string {
    let apiUrl = 'https://mirgor-engineering.atlassian.net/rest/api/3/issue';
    let request = `${apiUrl}/${issueName}/comment`
    
    return request;
}

function jiraUrlPostStoryPoints(issueName: string): string {
    let apiUrl = 'https://mirgor-engineering.atlassian.net/rest/api/3/issue';
    let request = `${apiUrl}/${issueName}`
    
    return request;
}

function encodeBase64(deencoded: string): string {
    let b = Buffer.from(deencoded);
    return b.toString('base64');
}

async function getJiraFromUrl(url: string): Promise<string> {
    let ret: string = '';
    let credentials = getCredentials();
    let deencoded = `${credentials.email}:${credentials.api_key}`;
    let encoded: string = encodeBase64(deencoded);

    let headers = {
            'Authorization': `Basic ${encoded}`,
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
    };

    console.log(headers);
    
    ret = await web.getData(url, headers);
    
    return ret;
}

async function postJiraFromUrl(url: string, data: any): Promise<string> {
    let ret: string = '';
    let credentials = getCredentials();
    let deencoded = `${credentials.email}:${credentials.api_key}`;
    let encoded: string = encodeBase64(deencoded);
    
    ret = await web.postData(url, data, 
        {
            'Authorization': `Basic ${encoded}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        });
    
    return ret;
}

async function putJiraFromUrl(url: string, data: any): Promise<string> {
    let ret: string = '';
    let credentials = getCredentials();
    let deencoded = `${credentials.email}:${credentials.api_key}`;
    let encoded: string = encodeBase64(deencoded);
    
    ret = await web.putData(url, data, 
        {
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

function startVotationGetter(votation_name: string, func: (votation: Votation) => void): void {
    _votation_running = true;
    getVotation(func, votation_name);
}

function stopVotationGetter(): void {
    _votation_running = false;
}
let i=0;
async function getVotation(func: (votation: Votation) => void, votation_name: string): Promise<void> {
    while(_votation_running) {
        let response: Votation = JSON.parse(await storage.get(`scrumpoker_celda_${votation_name}`));
        func(response);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function setCredentials(credentials: JiraCredentials) {
    _credentials = credentials;
}

function setCredentialsFile(credentials_path: string) {
    _credentials = file.readJSON(credentials_path).jira_credentials;
}

function getCredentials(): JiraCredentials {
    return _credentials;
}

async function getMyOpenSprintIssues(): Promise<string[]> {
    let url: string = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT', 'FAMPQNTDEV'],
        fields: ['summary'],
        limit: 1000,
        // assignee: '620bdfd1f97d180071738aa0',
        // openIssue: true,
        // currentSprint: true
    });
    log.dump.d({url});
    let response: IssuesResponse = JSON.parse(await getJiraFromUrl(url));
    file.writeJSON('./logs/MyOpenSprintIssues.json', response);
    let issues: string[] = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    
    return issues;
}

async function getMySprintIssues(): Promise<string[]> {
    let url: string = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT'],
        fields: ['summary'],
        limit: 1000,
        assignee: '620bdfd1f97d180071738aa0',
        //openIssue: true,
        currentSprint: true
    });
    log.dump.d({url});
    let response: IssuesResponse = JSON.parse(await getJiraFromUrl(url));
    file.writeJSON('./logs/MySprintIssues.json', response);
    let issues: string[] = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    
    return issues;
}

async function getMyOpenIssues(): Promise<string[]> {
    let url: string = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT'],
        fields: ['summary'],
        limit: 1000,
        assignee: '620bdfd1f97d180071738aa0',
        openIssue: true,
        //currentSprint: true
    });
    log.dump.d({url});
    let response: IssuesResponse = JSON.parse(await getJiraFromUrl(url));
    file.writeJSON('./logs/MyOpenIssues.json', response);
    let issues: string[] = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    
    return issues;
}

async function getAllMyIssues(): Promise<string[]> {
    let url: string = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT'],
        fields: ['summary'],
        limit: 1000,
        assignee: '620bdfd1f97d180071738aa0',
        //openIssue: true,
        //currentSprint: true
    });
    log.dump.d({url});
    let response: IssuesResponse = JSON.parse(await getJiraFromUrl(url));
    file.writeJSON('./logs/AllMyIssues.json', response);
    let issues: string[] = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    
    return issues;
}

async function getAllOpenSprintIssues(): Promise<string[]> {
    let url: string = jiraUrlGet({
        project: ['FAMPPLTDEV', 'FAMPVW', 'COMMONACT'],
        fields: ['summary'],
        limit: 1000,
        //assignee: '620bdfd1f97d180071738aa0',
        openIssue: true,
        currentSprint: true
    });
    log.dump.d({url});
    let response: IssuesResponse = JSON.parse(await getJiraFromUrl(url));
    file.writeJSON('./logs/AllOpenSprintIssues.json', response);
    let issues: string[] = [];
    response.issues.forEach(e => {
        issues.push(`<${e.key}>: ${e.fields.summary}`);
    });
    
    return issues;
}

async function postVotation(
    issueName: string,
    owner: string,
    votation: string
): Promise<void> {
    let url: string = jiraUrlPostComment(issueName);
    log.dump.d({url});
    
    let ret = await postJiraFromUrl(url, {
            "body": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "text": `OWNER: ${owner}\nTEAM: ${votation}`,
                                "type": "text"
                            }
                        ]
                    }
                ]
            }
        });

    log.d(`POST ret: ${ret}`);
    if(JSON.parse(ret)["created"]) {
        log.i(`~ Work logged correctly`);
    }
}

async function postLogWork(
    issueName: string,
    day: date.IDate,
    hour: string, // in format hh:mm
    comment: string,
    time: string | number // in minutes
): Promise<string> {
    let url: string = jiraUrlPostWorklog(issueName);
    log.dump.d({url});
    
    let seconds: number;
    if (typeof time === 'string') {
        seconds = parseFloat(time)*60*60;
    } else {
        seconds = time*60*60;
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
        
    log.d(`POST ret: ${ret}`);
    if(JSON.parse(ret)["created"]) {
        log.i(`~ Work logged correctly`);
    }
    
    return ret;
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

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
    postVotation,
    postLogWork
};
