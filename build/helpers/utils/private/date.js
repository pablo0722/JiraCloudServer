"use strict";
/*****************************************************************************
 * IMPORTS
 *****************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.getYear = exports.getMonth = exports.getWeek = exports.getDay = void 0;
const number_js_1 = require("./number.js");
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function getDay(offset = 0) {
    let d = new Date();
    d.setDate(d.getDate() + offset);
    return (0, number_js_1.itoa)(d.getDate(), 2);
}
exports.getDay = getDay;
function getWeek(offset = 0) {
    let d = new Date();
    d.setDate(d.getDate() + offset);
    let startDate = new Date(d.getFullYear(), 0, 0);
    let days = Math.floor((d.getTime() - startDate.getTime()) /
        (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil((d.getDay() + 1 + days) / 7);
    return weekNumber.toString();
}
exports.getWeek = getWeek;
function getMonth(offset = 0) {
    let d = new Date();
    d.setDate(d.getDate() + offset);
    return (0, number_js_1.itoa)(d.getMonth() + 1, 2);
}
exports.getMonth = getMonth;
function getYear(offset = 0) {
    let d = new Date();
    d.setDate(d.getDate() + offset);
    return d.getFullYear().toString().slice(-2);
}
exports.getYear = getYear;
function get(offset = 0) {
    return {
        day: getDay(offset),
        week: getWeek(offset),
        month: getMonth(offset),
        year: getYear(offset)
    };
}
exports.get = get;
