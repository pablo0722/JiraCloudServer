/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import inquirer from 'inquirer';
import { hasUncaughtExceptionCaptureCallback } from 'process';
import { log } from '../../utils/index.js';
    




/*****************************************************************************
 * DEFINITIONS
 *****************************************************************************/

type Answer = {[key:string]: string|string[]};
type NextFunc = (answer: Answer) => string;
type MenuFunc = (itemName: string, nextItem: string) => string;
type NextAnswer = {nextMenu: Menu | null, back: number, end: boolean};
type AnswerFunc = (nextItem: string|string[]) => NextAnswer;
type CreateFunc = (prompt: any) => void;
type MenuDict = {[key:string]: Menu};
type MenuType = 'list' | 'checkbox' | 'radio' | any;
type AnswerCallback = (p: Menu) => (Menu | null);
type CreateCallback = ((p: any) => void) | null;

class Menu {
    name: string;
    type: string;
    message: string;
    choices: string[];
    loop: boolean;
    answerFunc: AnswerFunc;
    createFunc: CreateFunc;
    
    protected static menues: {[key: string]: Menu};
    
    constructor(type: MenuType, message: string, choices: string[], createFunc: CreateFunc, answerFunc: AnswerFunc) {
        this.name = `${type}: ${message}`;
        this.type = type;
        this.message = message;
        this.choices = choices;
        this.loop = false;
        this.answerFunc = answerFunc;
        this.createFunc = createFunc;
    }
}





/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/

const _end: string = '\n<SALIR>';
const _back: string = '<ATRÁS>';
const _cancel: string = inquirer.cancelString;





/*****************************************************************************
 * GLOBAL VARIABLES
 *****************************************************************************/

let _firstMenu: Menu;
let _prevMenues: Menu[] = [];
let _currentMenu: Menu | null = null;





/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/

function _create(type: MenuType, message: string, choices: string[],
                 createFunc: CreateFunc, answerFunc: AnswerFunc): Menu {    
    let newMenu = new Menu(type, message, choices, createFunc, answerFunc);
        
    return newMenu;
}

function _makeFirst(menu: Menu): void {
    menu.choices.splice(-2, 1); // remove _back (pre-last item)
}





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function create(type: MenuType, message: string, choices: string[],
                createFunc: CreateFunc, answerFunc: AnswerFunc): Menu {
    let createdMenu: Menu;
    if(type=='list') {
        createdMenu = _create(type, message, choices.concat([_back, _end]), createFunc, answerFunc);
    } else {
        createdMenu = _create(type, message, choices, createFunc, answerFunc);
    }
    
    return createdMenu;
}

function handleAnswer(ans: Answer): void {
    log.dump.d({ans});
    let key: string = Object.keys(ans)[0];
    log.dump.d({key});
    if(!_currentMenu) {
        throw new Error("Current menu cannot be null");;
    }
    let thisMenu: Menu = _currentMenu;
    log.dump.d({thisMenu});
    let answer: string|string[] = Object.values(ans)[0];
    log.dump.d({answer});
    let next: NextAnswer;
    next = thisMenu.answerFunc(answer);

    if(next.end || (!next.back && !next.nextMenu)) {
        log.i('Gracias, vuelva prontos.');
    } else {
        let nextMenu: Menu = thisMenu;
        
        if(next.back) {
            while(next.back) {
                nextMenu = _prevMenues.pop()!;
                next.back--;
            }
        } else {
            if(!next.nextMenu) {
                throw new Error("Next menu cannot be null");
            }
            nextMenu = next.nextMenu;
            log.dump.d({nextMenu});
            _prevMenues.push(thisMenu);
            log.dump.d({_prevMenues});
        }
        _currentMenu = nextMenu;
        inquirer.prompt([nextMenu]).then(handleAnswer);
    }
}

function _menuCreateCallback(prompt: any): void {
    if(!_currentMenu) {
        throw new Error("Current menu cannot be null");
    }
    if(_currentMenu.createFunc) {
        _currentMenu.createFunc(prompt);
    }
}

function startProgram(firstMenu: Menu): void {
    _firstMenu = firstMenu;
    _makeFirst(firstMenu);
    _prevMenues.push(firstMenu);

    _currentMenu = firstMenu;

    inquirer.setCreateCallback(_menuCreateCallback);
    
    inquirer
        .prompt([_firstMenu])
        .then(handleAnswer);
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    // Const Strings
    _back,
    _cancel,
    _end,

    // Classes
    Menu,
    
    // Functions
    create,
    startProgram
};
