/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import { log, file, date, itoa, array } from '../../utils/index';
import * as issuesJSON from '../../../assets/issuesJSON/index';
import * as menu from './menu';
import * as webParse from '../../webParse/index';





/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/

let hoursChoices: string[] = [];
for (let hour = 0.5; hour <= 8; hour+=0.5) {
  hoursChoices.push(`${hour} hora/s`);
};

let daysChoices: string[] = [];
for (let i = 1; i <= 31; i++) {
   let month = itoa(i, 2);
   daysChoices.push(`Día: ${month}`);
};
let daysMenu: menu.Menu = menu.createBulk(hoursChoices, 'list', `Elegir día`, daysChoices);
  
let months: string[] = ['Enero', 'Febrero', 'Marzo',      'Abril',   'Mayo',      'Junio',
                        'Julio', 'Agosto',  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let monthsChoices: string[] = [];
for (let i = 1; i <= 12; i++) {
   let month = itoa(i, 2);
   monthsChoices.push(`Mes: ${month} (${months[i-1]})`);
};
let monthsMenu: menu.Menu = menu.createBulk(hoursChoices, 'list', `Elegir día`, daysChoices);

let yearsChoices: string[] = [];
for (let i = 0; i <= 2; i++) {
   let year: string = `${parseInt(date.getYear())-i}`;
   yearsChoices.push(`Año: 20${year}`);
};
let yearsMenu: menu.Menu = menu.create('<Ingresar día>', 'list', 'Ingrese el año que va a cargar horas', yearsChoices);

const _confirmName: string = '<CONFIRMAR>';





/*****************************************************************************
* GLOBAL VARIABLES
*****************************************************************************/

let menuPrincipalMessage: string;
let selectedDay: date.IDate;





/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/

function getDate(): {[key: string]: string} {
    let day:   string = date.getDay();
    let week:  number = parseInt(date.getWeek());
    let month: string = date.getMonth();
    let year:  string = date.getYear();
    let week1: string;
    let week2: string;
    
    if(week%2 == 1) {
        week1 = (week).toString();
        week2 = (week+1).toString();
    } else {
        week1 = (week-1).toString();
        week2 = (week).toString();
    }
    
    return {
        'day':   day,
        'week1': week1,
        'week2': week2,
        'month': month,
        'year':  year
    };
}





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function createWorklog(prefix: string, issuesName: string[], backMenuName: string): menu.Menu {
    let issuesMenu: menu.Menu;
    issuesName.forEach(issueName => {
        let issue: menu.Menu = menu.create(issueName, 'list', `Cuantas horas vas a cargar en el ${prefix} ${issueName}?`, hoursChoices);
        issue.addFuncBack((issueName: string, time: string | string[]): string => {
            let issue: {issueKey: string, summary: string} = issuesJSON.parse(issueName);
            /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '09:00', '', `${time}`);
            
            return backMenuName;
        });
    });
    issuesMenu = menu.create(`${prefix}s`, 'list', `En cual ${prefix} querés cargar horas?`, issuesName);

    return issuesMenu;
}

function createCommonIssuesWorklog(menuName: string, issuesName: string[], backMenuName: string): menu.Menu {
    let commonIssues: menu.Menu;
    issuesName.forEach(issueName => {
        let issue: menu.Menu = menu.create(issueName, 'list', `Cuantas horas vas a cargar en el Common Issue ${issueName}?`, hoursChoices);
        issue.addFuncBack((issueName: string, time: string | string[]): string => {
            let issue: {issueKey: string, summary: string} = issuesJSON.parse(issueName);
            log.dump.d({selectedDay});
            if (issue.summary == 'Daily') {
                /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '10:30', issue.summary, `${time}`);
            } else if (['Planning', 'Retrospective', 'Grooming', 'Review'].includes(issue.summary)) {
                /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '14:30', issue.summary, `${time}`);
            } else if (issue.summary == 'Log entry') {
                /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '09:00', issue.summary, `${time}`);
            } else {
                /*await*/ webParse.postLogWork(issue.issueKey, selectedDay, '15:00', issue.summary, `${time}`);
            }

            return backMenuName;
        });
    });
    commonIssues = menu.create(menuName, 'list', `En cual Common Issue querés cargar horas?`, issuesName);
    
    return commonIssues;
}

function createDaySelect(daySelectMenuName: string, menuPrincipal: menu.Menu): menu.Menu {
    let daySelectMenu: menu.Menu;
    menuPrincipalMessage = menuPrincipal.message;
    
    let hoyDay = date.getDay();
    let hoyMonth = date.getMonth();
    let hoyYear = date.getYear();
    
    daysMenu.addFuncNext((month: string, day: string | string[]): string => {
        selectedDay.day = `${day}`.substr(-2);
        selectedDay.month = `${month}`.substr(-2);
        menuPrincipal.message = `${menuPrincipalMessage} <Día: ${selectedDay.day}/${selectedDay.month}/${selectedDay.year} (hoy es ${hoyDay}/${hoyMonth}/${hoyYear})>`;

        return menuPrincipal.name;
    });
    
    monthsMenu.addFuncNext((year: string, month: string | string[]): string => {
        selectedDay.month = `${month}`.substr(-2);
        selectedDay.year = `${year}`.substr(-2);

        return daysMenu.name;
    });

    yearsMenu.addFuncNext((thisMenuName: string, year: string | string[]): string => {
        menuPrincipal.message = `${menuPrincipalMessage} <Año: ${year} (hoy es 20${date.getYear()})>`;
        selectedDay = date.get();
        selectedDay.year = `${year}`;

        return monthsMenu.name;
    });

    daySelectMenu = menu.create(daySelectMenuName, 'list', 'Elija una fecha', ['HOY', 'AYER', yearsMenu.name]);
    daySelectMenu.addFuncNext((thisMenuName: string, fecha: string | string[]): string => {
        if(fecha == 'HOY') {
            selectedDay.day = `${date.getDay()}`.substr(-2);
            selectedDay.month = `${date.getMonth()}`.substr(-2);
            selectedDay.year = `${date.getYear()}`.substr(-2);
            menuPrincipal.message = `${menuPrincipalMessage} <Día: ${selectedDay.day}/${selectedDay.month}/${selectedDay.year} (hoy es ${hoyDay}/${hoyMonth}/${hoyYear})>`;
            
            return menuPrincipal.name;
        } else if(fecha == 'AYER') {
            selectedDay.day = `${date.getDay(-1)}`.substr(-2);
            selectedDay.month = `${date.getMonth(-1)}`.substr(-2);
            selectedDay.year = `${date.getYear(-1)}`.substr(-2);
            menuPrincipal.message = `${menuPrincipalMessage} <Día: ${selectedDay.day}/${selectedDay.month}/${selectedDay.year} (hoy es ${hoyDay}/${hoyMonth}/${hoyYear})>`;
            
            return menuPrincipal.name;
        } else {
            
            return yearsMenu.name;
        }
    });

    return daySelectMenu;
}

function createIssuesMenu(menuName: string, issuesName: string[]): menu.Menu[] {
    let issueItems: menu.Menu[] = [];
    issuesName.forEach(issueName => {
        let issue: menu.Menu = menu.create(menuName, 'list', 'Elija un issue', issuesName);
        issueItems.push(issue);
    });

    return issueItems;
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    // Functions
    createWorklog,
    createCommonIssuesWorklog,
    createDaySelect,
    createIssuesMenu
};