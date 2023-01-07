/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import { log, file, date } from './helpers/utils/index';
import * as menu from './helpers/menu/index';
import * as issuesJSON from './assets/issuesJSON/index';
import * as webParse from './helpers/webParse/index';





/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/

const votacion_VW_id: string = 'VW';
const votacion_QUINT_id: string = 'QUINT';
const crear_votacion_id: string = 'Crear votacion';
const menu_principal_id: string = 'Menu principal';




/*****************************************************************************
 * MAIN
 *****************************************************************************/
async function main(): Promise<void> {
    webParse.setCredentialsFile(".config.json");

    let votacion_VW: menu.Menu = menu.create(votacion_VW_id, 'radio', 'Elige al owner de VW', []);
    let votacion_QUINT: menu.Menu = menu.create(votacion_QUINT_id, 'radio', 'Votación iniciada, ya se puede comenzar a votar\nElige al owner de QUINT', []);
    //let allIssues: menu.Menu = menu.createWorklog('common issue', issuesJSON.all, menuPrincipalName);

    let crear_votacion: menu.Menu = menu.create(crear_votacion_id, 'list', 'Crear votación', [votacion_VW_id, votacion_QUINT_id]);

    let menu_principal: menu.Menu = menu.create(menu_principal_id, 'list', 'Menú principal', [crear_votacion_id]);

    menu.startProgram(menu_principal);
}

async function logwork() {
    //await webParse.postLogWork('FAMPVW-99','31', '03', '22', '10:30', 'Daily', 30);
}

log.i('LOADING... (please wait)');

//logwork();
main();
