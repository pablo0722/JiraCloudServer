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
exports.createIssuesMenu = exports.createDaySelect = exports.createCommonIssuesWorklog = exports.createWorklog = void 0;
const index_1 = require("../../utils/index");
const issuesJSON = __importStar(require("../../../assets/issuesJSON/index"));
const menu = __importStar(require("./menu"));
const webParse = __importStar(require("../../webParse/index"));
/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
let hoursChoices = [];
for (let hour = 0.5; hour <= 8; hour += 0.5) {
    hoursChoices.push(`${hour} hora/s`);
}
;
let daysChoices = [];
for (let i = 1; i <= 31; i++) {
    let month = (0, index_1.itoa)(i, 2);
    daysChoices.push(`Día: ${month}`);
}
;
let daysMenu = menu.createBulk(hoursChoices, 'list', `Elegir día`, daysChoices);
let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let monthsChoices = [];
for (let i = 1; i <= 12; i++) {
    let month = (0, index_1.itoa)(i, 2);
    monthsChoices.push(`Mes: ${month} (${months[i - 1]})`);
}
;
let monthsMenu = menu.createBulk(hoursChoices, 'list', `Elegir día`, daysChoices);
let yearsChoices = [];
for (let i = 0; i <= 2; i++) {
    let year = `${parseInt(index_1.date.getYear()) - i}`;
    yearsChoices.push(`Año: 20${year}`);
}
;
let yearsMenu = menu.create('<Ingresar día>', 'list', 'Ingrese el año que va a cargar horas', yearsChoices);
const _confirmName = '<CONFIRMAR>';
/*****************************************************************************
* GLOBAL VARIABLES
*****************************************************************************/
let menuPrincipalMessage;
let selectedDay;
/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/
function getDate() {
    let day = index_1.date.getDay();
    let week = parseInt(index_1.date.getWeek());
    let month = index_1.date.getMonth();
    let year = index_1.date.getYear();
    let week1;
    let week2;
    if (week % 2 == 1) {
        week1 = (week).toString();
        week2 = (week + 1).toString();
    }
    else {
        week1 = (week - 1).toString();
        week2 = (week).toString();
    }
    return {
        'day': day,
        'week1': week1,
        'week2': week2,
        'month': month,
        'year': year
    };
}
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function createWorklog(prefix, issuesName, backMenuName) {
    let issuesMenu;
    issuesName.forEach(issueName => {
        let issue = menu.create(issueName, 'list', `Cuantas horas vas a cargar en el ${prefix} ${issueName}?`, hoursChoices);
        issue.addFuncBack((issueName, time) => {
            let issue = issuesJSON.parse(issueName);
            /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '09:00', '', `${time}`);
            return backMenuName;
        });
    });
    issuesMenu = menu.create(`${prefix}s`, 'list', `En cual ${prefix} querés cargar horas?`, issuesName);
    return issuesMenu;
}
exports.createWorklog = createWorklog;
function createCommonIssuesWorklog(menuName, issuesName, backMenuName) {
    let commonIssues;
    issuesName.forEach(issueName => {
        let issue = menu.create(issueName, 'list', `Cuantas horas vas a cargar en el Common Issue ${issueName}?`, hoursChoices);
        issue.addFuncBack((issueName, time) => {
            let issue = issuesJSON.parse(issueName);
            index_1.log.dump.d({ selectedDay });
            if (issue.summary == 'Daily') {
                /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '10:30', issue.summary, `${time}`);
            }
            else if (['Planning', 'Retrospective', 'Grooming', 'Review'].includes(issue.summary)) {
                /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '14:30', issue.summary, `${time}`);
            }
            else if (issue.summary == 'Log entry') {
                /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '09:00', issue.summary, `${time}`);
            }
            else {
                /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '15:00', issue.summary, `${time}`);
            }
            return backMenuName;
        });
    });
    commonIssues = menu.create(menuName, 'list', `En cual Common Issue querés cargar horas?`, issuesName);
    return commonIssues;
}
exports.createCommonIssuesWorklog = createCommonIssuesWorklog;
function createDaySelect(daySelectMenuName, menuPrincipal) {
    let daySelectMenu;
    menuPrincipalMessage = menuPrincipal.message;
    let hoyDay = index_1.date.getDay();
    let hoyMonth = index_1.date.getMonth();
    let hoyYear = index_1.date.getYear();
    daysMenu.addFuncNext((month, day) => {
        selectedDay.day = `${day}`.substr(-2);
        selectedDay.month = `${month}`.substr(-2);
        menuPrincipal.message = `${menuPrincipalMessage} <Día: ${selectedDay.day}/${selectedDay.month}/${selectedDay.year} (hoy es ${hoyDay}/${hoyMonth}/${hoyYear})>`;
        return menuPrincipal.name;
    });
    monthsMenu.addFuncNext((year, month) => {
        selectedDay.month = `${month}`.substr(-2);
        selectedDay.year = `${year}`.substr(-2);
        return daysMenu.name;
    });
    yearsMenu.addFuncNext((thisMenuName, year) => {
        menuPrincipal.message = `${menuPrincipalMessage} <Año: ${year} (hoy es 20${index_1.date.getYear()})>`;
        selectedDay = index_1.date.get();
        selectedDay.year = `${year}`;
        return monthsMenu.name;
    });
    daySelectMenu = menu.create(daySelectMenuName, 'list', 'Elija una fecha', ['HOY', 'AYER', yearsMenu.name]);
    daySelectMenu.addFuncNext((thisMenuName, fecha) => {
        if (fecha == 'HOY') {
            selectedDay.day = `${index_1.date.getDay()}`.substr(-2);
            selectedDay.month = `${index_1.date.getMonth()}`.substr(-2);
            selectedDay.year = `${index_1.date.getYear()}`.substr(-2);
            menuPrincipal.message = `${menuPrincipalMessage} <Día: ${selectedDay.day}/${selectedDay.month}/${selectedDay.year} (hoy es ${hoyDay}/${hoyMonth}/${hoyYear})>`;
            return menuPrincipal.name;
        }
        else if (fecha == 'AYER') {
            selectedDay.day = `${index_1.date.getDay(-1)}`.substr(-2);
            selectedDay.month = `${index_1.date.getMonth(-1)}`.substr(-2);
            selectedDay.year = `${index_1.date.getYear(-1)}`.substr(-2);
            menuPrincipal.message = `${menuPrincipalMessage} <Día: ${selectedDay.day}/${selectedDay.month}/${selectedDay.year} (hoy es ${hoyDay}/${hoyMonth}/${hoyYear})>`;
            return menuPrincipal.name;
        }
        else {
            return yearsMenu.name;
        }
    });
    return daySelectMenu;
}
exports.createDaySelect = createDaySelect;
function createIssuesMenu(menuName, issuesName) {
    let issueItems = [];
    issuesName.forEach(issueName => {
        let issue = menu.create(menuName, 'list', 'Elija un issue', issuesName);
        issueItems.push(issue);
    });
    return issueItems;
}
exports.createIssuesMenu = createIssuesMenu;
