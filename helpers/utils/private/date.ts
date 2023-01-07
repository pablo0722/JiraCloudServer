/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import {itoa} from './number.js';





/*****************************************************************************
 * DEFINITIONS
 *****************************************************************************/

type IDate = {
    day: string,
    week: string,
    month: string,
    year: string,
};





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function getDay(offset: number = 0): string {
    let d: Date = new Date();
    d.setDate(d.getDate() + offset);
    return itoa(d.getDate(), 2);
}

function getWeek(offset: number = 0): string {
    let d: Date = new Date();
    d.setDate(d.getDate() + offset);
    let startDate: Date = new Date(d.getFullYear(), 0, 0);
    let days: number = Math.floor((d.getTime() - startDate.getTime()) /
        (24 * 60 * 60 * 1000));
    let weekNumber: number = Math.ceil(
        (d.getDay() + 1 + days) / 7);

    return weekNumber.toString();
}

function getMonth(offset: number = 0): string {
    let d: Date = new Date();
    d.setDate(d.getDate() + offset);
    return itoa(d.getMonth()+1, 2);
}

function getYear(offset: number = 0): string {
    let d: Date = new Date();
    d.setDate(d.getDate() + offset);
    return d.getFullYear().toString().slice(-2);
}

function get(offset: number = 0): IDate {
    
    return {
        day: getDay(offset),
        week: getWeek(offset),
        month: getMonth(offset),
        year: getYear(offset)};
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    // Types
    IDate,
    
    // Functions
    getDay,
    getWeek,
    getMonth,
    getYear,
    get
};