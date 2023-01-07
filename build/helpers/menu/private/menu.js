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
exports.startProgram = exports.createBulk = exports.create = exports.Menu = void 0;
const inquirer = __importStar(require("inquirer"));
const index_1 = require("../../utils/index");
class Menu {
    constructor(name, type, message, choices) {
        this.type = type;
        this.name = name;
        this.message = message;
        this.choices = choices;
        this.loop = false;
        this.hasFuncBack = false;
        this.hasFuncNext = false;
        this.hasFuncChoiceNext = false;
        this.menuFunc = () => { throw new Error(`func not defined for menu "${this.name}"`); };
        this.choiceFunc = () => { throw new Error(`func not defined for menu "${this.name}"`); };
    }
    addFuncBack(menuFunc) {
        this.menuFunc = menuFunc;
        this.hasFuncBack = true;
        this.hasFuncNext = false;
        this.hasFuncChoiceNext = false;
    }
    addFuncNext(menuFunc) {
        this.menuFunc = menuFunc;
        this.hasFuncBack = false;
        this.hasFuncNext = true;
        this.hasFuncChoiceNext = false;
    }
    addFuncChoiceNext(choiceFunc) {
        this.choiceFunc = choiceFunc;
        this.hasFuncBack = false;
        this.hasFuncNext = false;
        this.hasFuncChoiceNext = true;
    }
}
exports.Menu = Menu;
/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
const _end = '\n<SALIR>';
const _back = '<ATRÁS>';
/*****************************************************************************
 * GLOBAL VARIABLES
 *****************************************************************************/
let _firstMenu;
let _prevMenues = [];
let _allMenues = {};
/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/
function _create(menuName, type, message, choices) {
    let newMenu = new Menu(menuName, type, message, choices);
    _allMenues[menuName] = newMenu;
    return newMenu;
}
function _makeFirst(menu) {
    menu.choices.splice(-2, 1); // remove _back (pre-last item)
}
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
function create(menuName, type, message, choices = []) {
    let createdMenu;
    if (type == 'list') {
        createdMenu = _create(menuName, type, message, choices.concat([_back, _end]));
    }
    else {
        createdMenu = _create(menuName, type, message, choices);
    }
    return createdMenu;
}
exports.create = create;
function createBulk(menuNames, type, message, choices = []) {
    let createdMenu;
    if (type == 'list') {
        createdMenu = _create(menuNames[0], type, message, choices.concat([_back, _end]));
    }
    else {
        createdMenu = _create(menuNames[0], type, message, choices);
    }
    menuNames.forEach(e => {
        _allMenues[e] = createdMenu;
    });
    return createdMenu;
}
exports.createBulk = createBulk;
function handleAnswer(ans) {
    index_1.log.dump.d({ ans });
    let key = Object.keys(ans)[0];
    index_1.log.dump.d({ key });
    let thisMenu = _allMenues[key];
    index_1.log.dump.d({ thisMenu });
    let next = Object.values(ans)[0];
    let nextMenuName;
    if (Array.isArray(next)) {
        let nextChoiceName = next;
        index_1.log.dump.d({ nextChoiceName });
        nextMenuName = thisMenu.choiceFunc(thisMenu.name, nextChoiceName);
    }
    else {
        nextMenuName = next;
        index_1.log.dump.d({ nextMenuName });
    }
    let gotoNext = false;
    if (nextMenuName == _end) {
        index_1.log.i('Gracias, vuelva prontos.');
    }
    else {
        let nextMenu = thisMenu;
        if (nextMenuName == _back) {
            nextMenu = _prevMenues.pop();
        }
        else {
            if (thisMenu.hasFuncBack) {
                let backMenuName = thisMenu.menuFunc(thisMenu.name, nextMenuName);
                index_1.log.dump.d({ backMenuName });
                if (backMenuName == '') {
                    // go back cancelled
                    gotoNext = true;
                }
                else {
                    let backMenuAux = thisMenu;
                    while (backMenuAux && backMenuAux.name != backMenuName) {
                        backMenuAux = _prevMenues.pop();
                    }
                    if (!backMenuAux) {
                        _prevMenues = [];
                        nextMenu = _firstMenu;
                    }
                    else {
                        nextMenu = backMenuAux;
                    }
                }
            }
            else {
                if (thisMenu.hasFuncNext) {
                    nextMenuName = thisMenu.menuFunc(thisMenu.name, nextMenuName);
                }
                gotoNext = true;
            }
        }
        if (gotoNext) {
            nextMenu = _allMenues[nextMenuName];
            index_1.log.dump.d({ nextMenu });
            _prevMenues.push(thisMenu);
            index_1.log.dump.d({ _prevMenues });
        }
        inquirer
            .prompt([nextMenu])
            .then(handleAnswer);
    }
}
function startProgram(firstMenu) {
    inquirer.registerPrompt('radio', require('./inquirer_radio'));
    _firstMenu = firstMenu;
    _makeFirst(firstMenu);
    index_1.log.dump.d({ _allMenues });
    inquirer
        .prompt([_firstMenu])
        .then(handleAnswer);
}
exports.startProgram = startProgram;
