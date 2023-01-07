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
const index_1 = require("./helpers/utils/index");
const menu = __importStar(require("./helpers/menu/index"));
const webParse = __importStar(require("./helpers/webParse/index"));
/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
const votacion_VW_id = 'VW';
const votacion_QUINT_id = 'QUINT';
const crear_votacion_id = 'Crear votacion';
const menu_principal_id = 'Menu principal';
/*****************************************************************************
 * MAIN
 *****************************************************************************/
async function main() {
    webParse.setCredentialsFile(".config.json");
    let votacion_VW = menu.create(votacion_VW_id, 'radio', 'Elige al owner de VW', []);
    let votacion_QUINT = menu.create(votacion_QUINT_id, 'radio', 'Votación iniciada, ya se puede comenzar a votar\nElige al owner de QUINT', []);
    //let allIssues: menu.Menu = menu.createWorklog('common issue', issuesJSON.all, menuPrincipalName);
    let crear_votacion = menu.create(crear_votacion_id, 'list', 'Crear votación', [votacion_VW_id, votacion_QUINT_id]);
    let menu_principal = menu.create(menu_principal_id, 'list', 'Menú principal', [crear_votacion_id]);
    menu.startProgram(menu_principal);
}
async function logwork() {
    //await webParse.postLogWork('FAMPVW-99','31', '03', '22', '10:30', 'Daily', 30);
}
index_1.log.i('LOADING... (please wait)');
//logwork();
main();
