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

    let menuPrincipal: menu.Menu = menu.create('list', 'Menú principal', ['Crear votacion'],
        menuPrincipalCreateCallback, menuPrincipalAnswerCallback);

    function menuPrincipalCreateCallback(prompt: any) {
    }

    function menuPrincipalAnswerCallback(nextItem: string|string[]) {
        if(nextItem == menu._end)
        {
            return {nextMenu: null, back: 0, end: true};
        }
        return {nextMenu: crearVotacion, back: 0, end: false};
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

        let owner: string = "";
        let votation = _votation.map((v)=> {return v.split(": ")[1]}).join(" ");
        _votation.forEach((v) => {
            if(nextItem == v) {
                owner = v.split(": ")[1];
            }
        });

        webParse.postVotation(_issue, owner, votation);

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
