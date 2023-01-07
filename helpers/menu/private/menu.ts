/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import * as inquirer from 'inquirer';
import { log } from '../../utils/index';





/*****************************************************************************
 * DEFINITIONS
 *****************************************************************************/

type Answer = {[key:string]: string|string[]};
type NextFunc = (answer: Answer) => string;
type MenuFunc = (itemName: string, nextItem: string) => string;
type ChoiceFunc = (itemName: string, nextItem: string[]) => string;
type MenuDict = {[key:string]: Menu};
type MenuType = 'list' | 'checkbox' | 'radio' | any;

class Menu {
    type: string;
    name: string;
    message: string;
    choices: string[];
    loop: boolean;
    hasFuncBack: boolean;
    hasFuncNext: boolean;
    hasFuncChoiceNext: boolean;
    menuFunc: MenuFunc;
    choiceFunc: ChoiceFunc;
    
    protected static menues: {[key: string]: Menu};
    
    constructor(name: string, type: MenuType, message: string, choices: string[]) {
        this.type = type;
        this.name = name;
        this.message = message;
        this.choices = choices;
        this.loop = false;
        this.hasFuncBack = false;
        this.hasFuncNext = false;
        this.hasFuncChoiceNext = false;
        this.menuFunc = () => {throw new Error(`func not defined for menu "${this.name}"`)};
        this.choiceFunc = () => {throw new Error(`func not defined for menu "${this.name}"`)};
    }
    
    addFuncBack(menuFunc: MenuFunc) {
        this.menuFunc = menuFunc;
        this.hasFuncBack = true;
        this.hasFuncNext = false;
        this.hasFuncChoiceNext = false;
    }
    
    addFuncNext(menuFunc: MenuFunc) {
        this.menuFunc = menuFunc;
        this.hasFuncBack = false;
        this.hasFuncNext = true;
        this.hasFuncChoiceNext = false;
    }
    
    addFuncChoiceNext(choiceFunc: ChoiceFunc) {
        this.choiceFunc = choiceFunc;
        this.hasFuncBack = false;
        this.hasFuncNext = false;
        this.hasFuncChoiceNext = true;
    }
}





/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/

const _end: string = '\n<SALIR>';

const _back: string = '<ATRÁS>';





/*****************************************************************************
 * GLOBAL VARIABLES
 *****************************************************************************/

let _firstMenu: Menu;
let _prevMenues: Menu[] = [];
let _allMenues: MenuDict = {};





/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/

function _create(menuName: string, type: MenuType, message: string, choices: string[]): Menu {    
    let newMenu = new Menu(menuName, type, message, choices);
    
    _allMenues[menuName] = newMenu;
    
    return newMenu;
}

function _makeFirst(menu: Menu): void {
    menu.choices.splice(-2, 1); // remove _back (pre-last item)
}





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function create(menuName: string, type: MenuType, message: string, choices: string[] = []): Menu {
    let createdMenu: Menu;
    if(type=='list') {
        createdMenu = _create(menuName, type, message, choices.concat([_back, _end]));
    } else {
        createdMenu = _create(menuName, type, message, choices);
    }
    
    return createdMenu;
}

function createBulk(menuNames: string[], type: MenuType, message: string, choices: string[] = []): Menu {
    let createdMenu: Menu;
    if(type=='list') {
        createdMenu = _create(menuNames[0], type, message, choices.concat([_back, _end]));
    } else {
        createdMenu = _create(menuNames[0], type, message, choices);
    }
    menuNames.forEach(e => {
        _allMenues[e] = createdMenu;
    });
    
    return createdMenu;
}

function handleAnswer(ans: Answer): void {
    log.dump.d({ans});
    let key: string = Object.keys(ans)[0];
    log.dump.d({key});
    let thisMenu: Menu = _allMenues[key];
    log.dump.d({thisMenu});
    let next: string|string[] = Object.values(ans)[0];
    let nextMenuName: string;
    if(Array.isArray(next)){
        let nextChoiceName: string[] = next;
        log.dump.d({nextChoiceName});
        nextMenuName = thisMenu.choiceFunc(thisMenu.name, nextChoiceName);
    }else{
        nextMenuName = next;
        log.dump.d({nextMenuName});
    }
    let gotoNext: boolean = false;
    
    if(nextMenuName == _end) {
        log.i('Gracias, vuelva prontos.');
    } else {
        let nextMenu: Menu = thisMenu;
        
        if(nextMenuName == _back) {
            nextMenu = _prevMenues.pop()!;
        } else {
            if(thisMenu.hasFuncBack) {
                let backMenuName = thisMenu.menuFunc(thisMenu.name, nextMenuName);
                log.dump.d({backMenuName});
                if(backMenuName == '') {
                    // go back cancelled
                    gotoNext = true;
                } else {
                    let backMenuAux: Menu | undefined = thisMenu;
                    while(backMenuAux && backMenuAux.name != backMenuName) {
                        backMenuAux = _prevMenues.pop();
                    }
                    if(!backMenuAux) {
                        _prevMenues = [];
                        nextMenu = _firstMenu;
                    } else {
                        nextMenu = backMenuAux;
                    }
                }
            } else {
                if(thisMenu.hasFuncNext) {
                    nextMenuName = thisMenu.menuFunc(thisMenu.name, nextMenuName);
                }
                gotoNext = true;
            }
        }
        
        if(gotoNext) {
            nextMenu = _allMenues[nextMenuName];
            log.dump.d({nextMenu});
            _prevMenues.push(thisMenu);
            log.dump.d({_prevMenues});
        }
        
        inquirer
            .prompt([nextMenu])
            .then(handleAnswer);
    }
}

function startProgram(firstMenu: Menu): void {
    inquirer.registerPrompt('radio', require('./inquirer_radio'));

    _firstMenu = firstMenu;
    _makeFirst(firstMenu);
    
    log.dump.d({_allMenues});
    
    inquirer
        .prompt([_firstMenu])
        .then(handleAnswer);
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    // Classes
    Menu,
    
    // Functions
    create,
    createBulk,
    startProgram
};
