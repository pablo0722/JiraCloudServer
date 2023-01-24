/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import { log, file, date, web } from './helpers/utils/index.js';
import * as menu from './helpers/menu/index.js';
import * as issuesJSON from './assets/issuesJSON/index.js';
import * as webParse from './helpers/webParse/index.js';
import fetch from 'node-fetch';
import inquirer from 'inquirer';





/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/

const votacion_VW_id: string = 'VW';
const votacion_VW_create_id  = '';
const votacion_QUINT_id: string = 'QUINT';
const crear_votacion_id: string = 'Crear votacion';
const menu_principal_id: string = 'Menu principal';





/*****************************************************************************
 * GLOBAL VARIABLES
 *****************************************************************************/

let _issue: string;
let _votation: string[];




/*****************************************************************************
 * MAIN
 *****************************************************************************/
async function main(): Promise<void> {
    webParse.setCredentialsFile(".config.json");

    let votacionVW: menu.Menu = menu.create('radio', 'Votación iniciada, ya se puede comenzar a votar\nElige al owner del issue de VW', [],
        votacionVWCreateCallback, votacionVWAnswerCallback);

    let votacionQuint: menu.Menu = menu.create('radio', 'Votación iniciada, ya se puede comenzar a votar\nElige al owner del issue de QUINT', [],
        votacionQuintCreateCallback, votacionQuintAnswerCallback);

    let votacionVWIssue: menu.Menu = menu.create('input', 'Ingrese el issue de VW', [],
        votacionVWIssueCreateCallback, votacionVWIssueAnswerCallback);

    let votacionQuintIssue: menu.Menu = menu.create('input', 'Ingrese el issue de QUINT', [],
        votacionQuintIssueCreateCallback, votacionQuintIssueAnswerCallback);

    let crearVotacion: menu.Menu = menu.create('list', 'Crear votación', ['VW', 'QUINT'],
        crearVotacionCreateCallback, crearVotacionAnswerCallback);

    let resetVotacionVWIssue: menu.Menu = menu.create('input', 'Ingrese el issue de VW', [],
        resetVotacionVWIssueCreateCallback, resetVotacionVWIssueAnswerCallback);

    let resetVotacionQuintIssue: menu.Menu = menu.create('input', 'Ingrese el issue de QUINT', [],
        resetVotacionQuintIssueCreateCallback, resetVotacionQuintIssueAnswerCallback);

    let resetVotacion: menu.Menu = menu.create('list', 'Crear votación', ['VW', 'QUINT'],
        resetVotacionCreateCallback, resetVotacionAnswerCallback);

    let menuPrincipal: menu.Menu = menu.create('list', 'Menú principal', ['Crear votacion', 'Resetear votación'],
        menuPrincipalCreateCallback, menuPrincipalAnswerCallback);

    function menuPrincipalCreateCallback(prompt: any) {
    }

    function menuPrincipalAnswerCallback(nextItem: string|string[]) {
        if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }
        if(nextItem == 'Crear votacion') {
            return {nextMenu: crearVotacion, back: 0, end: false};
        } else {
            return {nextMenu: resetVotacion, back: 0, end: false};
        }
    }

    function crearVotacionCreateCallback(prompt: any) {
    }

    function crearVotacionAnswerCallback(nextItem: string|string[]) {
        if(nextItem == menu._back || nextItem == menu._cancel)
        {
            return {nextMenu: null, back: 1, end: false};
        }
        else if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }
        else if(nextItem == 'VW')
        {
            return {nextMenu: votacionVWIssue, back: 0, end: false};
        }
        else if(nextItem == 'QUINT')
        {
            return {nextMenu: votacionQuintIssue, back: 0, end: false};
        }

        return {nextMenu: null, back: 0, end: true};
    }

    function resetVotacionCreateCallback(prompt: any) {
    }

    function resetVotacionAnswerCallback(nextItem: string|string[]) {
        if(nextItem == menu._back || nextItem == menu._cancel)
        {
            return {nextMenu: null, back: 1, end: false};
        }
        else if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }
        else if(nextItem == 'VW')
        {
            return {nextMenu: resetVotacionVWIssue, back: 0, end: false};
        }
        else if(nextItem == 'QUINT')
        {
            return {nextMenu: resetVotacionQuintIssue, back: 0, end: false};
        }

        return {nextMenu: null, back: 0, end: true};
    }

    function resetVotacionQuintIssueCreateCallback(prompt: any) {
    }

    function resetVotacionQuintIssueAnswerCallback(nextItem: string|string[]) {
        if(nextItem == menu._back || nextItem == menu._cancel)
        {
            return {nextMenu: null, back: 1, end: false};
        }
        else if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }

        if(Array.isArray(nextItem)) {
            nextItem = nextItem[0];
        }

        _issue = `FAMPQNTDEV-${nextItem}`;
        webParse.rmVotationGetter(_issue);

        return {nextMenu: null, back: 2, end: false};
    }

    function resetVotacionVWIssueCreateCallback(prompt: any) {
    }

    function resetVotacionVWIssueAnswerCallback(nextItem: string|string[]) {
        if(nextItem == menu._back || nextItem == menu._cancel)
        {
            return {nextMenu: null, back: 1, end: false};
        }
        else if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }

        if(Array.isArray(nextItem)) {
            nextItem = nextItem[0];
        }

        _issue = `FAMPVW-${nextItem}`;
        webParse.rmVotationGetter(_issue);

        return {nextMenu: null, back: 2, end: false};
    }

    function votacionVWIssueCreateCallback(prompt: any) {
    }

    function votacionVWIssueAnswerCallback(nextItem: string|string[]) {
        if(nextItem == menu._back || nextItem == menu._cancel)
        {
            return {nextMenu: null, back: 1, end: false};
        }
        else if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }

        if(Array.isArray(nextItem)) {
            nextItem = nextItem[0];
        }

        _issue = `FAMPVW-${nextItem}`;

        console.log("Cópiale el siguiente link a los votantes:");
        console.log(`https://enterprise-tools.vercel.app/scrum_poker/vote?issue=${_issue}`);

        return {nextMenu: votacionVW, back: 0, end: false};
    }

    function votacionQuintIssueCreateCallback(prompt: any) {
    }

    function votacionQuintIssueAnswerCallback(nextItem: string|string[]) {
        if(nextItem == menu._back || nextItem == menu._cancel)
        {
            return {nextMenu: null, back: 1, end: false};
        }
        else if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }

        if(Array.isArray(nextItem)) {
            nextItem = nextItem[0];
        }

        _issue = `FAMPQNTDEV-${nextItem}`;

        console.log("Cópiale el siguiente link a los votantes:");
        console.log(`https://enterprise-tools.vercel.app/scrum_poker/create?issue=${_issue}`);

        return {nextMenu: votacionQuint, back: 0, end: false};
    }

    function votacionQuintCreateCallback(prompt: any) {
        radio_prompt = <inquirer.RadioPrompt> prompt;
        webParse.startVotationGetter(_issue, votationGetter);
    }

    function votacionQuintAnswerCallback(nextItem: string|string[]) {
        webParse.stopVotationGetter();

        if(nextItem == menu._back || nextItem == menu._cancel)
        {
            return {nextMenu: null, back: 2, end: false};
        }
        else if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }

        let pointList: {[key: string]: string} = {XS: "2", S: "3", M: "5", L: "8", XL: "13"};
        let pointResult: {[key: string]: number} = {XS: 0, S: 0, M: 0, L: 0, XL: 0};

        let owner: string = "";
        let votation = _votation.map((v)=> {return v.split(": ")[1]}).join(" ");
        _votation.forEach((v) => {
            let vote = v.split(": ")[1];
            pointResult[vote]+=1;
            if(nextItem == v) {
                owner = vote;
            }
        });

        let storyKeys: string[] = [];
        let storyValue: number = -1;

        for (const [key, value] of Object.entries(pointResult)) {
            if(value > storyValue) {
                storyKeys = [key];
                storyValue = value;
            } else if(value == storyValue) {
                storyKeys.push(key);
            }
        }

        let storyPoints: string = "";
        let error: string = "";

        if(storyKeys.length == 1) {
            storyPoints = pointList[storyKeys[0]];
        } else if(storyKeys.length > 1) {
            if(storyKeys.includes(owner)) {
                storyPoints = pointList[owner];
            } else {
                error = "Hay empate y el owner no desempata.";
            }
        } else {
            error = "No se registraron votos.";
        }

        if(storyPoints == "") {
            // Error in votation: go back
            console.log(`Error: resultado de votación incorrecta. ${error}`);
            return {nextMenu: null, back: 0, end: false};
        }

        webParse.postVotation(_issue, owner, votation, storyPoints);
        webParse.rmVotationGetter(_issue);

        return {nextMenu: null, back: 2, end: false};
    }

    function votacionVWCreateCallback(prompt: any) {
        radio_prompt = <inquirer.RadioPrompt> prompt;
        webParse.startVotationGetter(_issue, votationGetter);
    }

    function votacionVWAnswerCallback(nextItem: string|string[]) {
        webParse.stopVotationGetter();

        if(nextItem == menu._back || nextItem == menu._cancel)
        {
            return {nextMenu: null, back: 2, end: false};
        }
        else if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }

        let owner: string = "";
        let votation = _votation.map((v)=> {return v.split(": ")[1]}).join(" ");
        _votation.forEach((v) => {
            if(nextItem == v) {
                owner = v.split(": ")[1];
            }
        });

        webParse.postVotation(_issue, owner, votation, "");
        webParse.rmVotationGetter(_issue);

        return {nextMenu: null, back: 2, end: false};
    }

    menu.startProgram(menuPrincipal);
}

let radio_prompt: inquirer.RadioPrompt;
async function votationGetter(votation: webParse.Votation) {
    let selected_name = radio_prompt.getSelected();
    selected_name = selected_name.substring(0, selected_name.indexOf(":"));;
    let selected_value: number = -1;

    let pointed_name = radio_prompt.getPointed();
    pointed_name = pointed_name.substring(0, pointed_name.indexOf(":"));;
    let pointed_value: number = 0;

    let values: string[] = [];
    let i = 0;
    for (let key in votation) {
        values.push(`${key}: ${votation[key]}`);
        if(selected_name == key) {
            selected_value = i;
        }
        if(pointed_name == key) {
            pointed_value = i;
        }
        i++;
    }
    _votation = values;
    radio_prompt.update(values, pointed_value, selected_value);
}

log.i('LOADING... (please wait)');

main();
