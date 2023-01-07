'use strict';
/**
 * `list` type prompt
 */

const chalk = require('chalk');
const figures = require('figures');
// const cliCursor = require('cli-cursor');
// const runAsync = require('run-async');
// const { flatMap, map, take, takeUntil } = require('rxjs/operators');
// const Base = require('node_modules/inquirer/lib//base');
// const observe = require('../utils/events');
// const Paginator = require('../utils/paginator');
// const incrementListIndex = require('../utils/incrementListIndex');
//const Choices = require('../objects/choices');
const CheckboxPrompt = require('../../../../node_modules/inquirer/lib/prompts/checkbox.js');

class RadioPrompt extends CheckboxPrompt {

  constructor(questions: any, rl: any, answers: any) {
    super(questions, rl, answers);
    this.choices = {};
  }

  _run(cb: any) {
    super._run(cb);
  }

  clearAllChoices() {
    this.opt.choices.forEach((choice: any) => {
      if (choice.type !== 'separator') {
        choice.checked = false;
      }
    });
  }

  onSpaceKey() {
    this.clearAllChoices();
    this.toggleChoice(this.pointer);
    this.render();
  }

  onInverseKey() {
    this.clearAllChoices();
    this.render();
  }

  onAllKey() {
    this.opt.choices.choices.forEach((value: string) => {console.log(value)})
  }

  onNumberKey(input: any) {
    this.updateChoices('nuevo', input.toString());
  }

  updateChoices(key: string, value: string) {
    if(this.choices[key]) {
      this.choices[key] = value;
    } else {
      this.choices[key] = value;
      this.opt.choices.push(`${key}: ${value}`);
    }
checked:
    this.render();
  }

  render(...args : any) {
    // Render question
    let message = this.getQuestion();
    let bottomContent = '';

    if (!this.dontShowHints) {
      message +=
        '(Press ' +
        chalk.cyan.bold('<space>') +
        ' to select, ' +
        chalk.cyan.bold('<i>') +
        ' to unselect, and ' +
        chalk.cyan.bold('<enter>') +
        ' to proceed)';
    }

    // Render choices or answer depending on the state
    if (this.status === 'answered') {
      message += chalk.cyan(this.selection.join(', '));
    } else {
      const choicesStr = renderChoices(this.opt.choices, this.pointer);
      const indexPosition = this.opt.choices.indexOf(
        this.opt.choices.getChoice(this.pointer)
      );
      const realIndexPosition =
        this.opt.choices.reduce((acc: any, value: any, i: any) => {
          // Dont count lines past the choice we are looking at
          if (i > indexPosition) {
            return acc;
          }
          // Add line if it's a separator
          if (value.type === 'separator') {
            return acc + 1;
          }

          let l = value.name;
          // Non-strings take up one line
          if (typeof l !== 'string') {
            return acc + 1;
          }

          // Calculate lines taken up by string
          l = l.split('\n');
          return acc + l.length;
        }, 0) - 1;
      message +=
        '\n' + this.paginator.paginate(choicesStr, realIndexPosition, this.opt.pageSize);
    }

    if (args && args[0]) {
      bottomContent = chalk.red('>> ') + args[0];
    }

    this.screen.render(message, bottomContent);
  }
}

/**
 * Function for rendering checkbox choices
 * @param  {Number} pointer Position of the pointer
 * @return {String}         Rendered content
 */

function renderChoices(choices: any, pointer: any) {
  let output = '';
  let separatorOffset = 0;

  choices.forEach((choice: any, i: any) => {
    if (choice.type === 'separator') {
      separatorOffset++;
      output += ' ' + choice + '\n';
      return;
    }

    if (choice.disabled) {
      separatorOffset++;
      output += ' - ' + choice.name;
      output += ` (${
        typeof choice.disabled === 'string' ? choice.disabled : 'Disabled'
      })`;
    } else {
      const line = getCheckbox(choice.checked) + ' ' + choice.name;
      if (i - separatorOffset === pointer) {
        output += chalk.cyan(figures.pointer + line);
      } else {
        output += ' ' + line;
      }
    }

    output += '\n';
  });

  return output.replace(/\n$/, '');
}

/**
 * Get the checkbox
 * @param  {Boolean} checked - add a X or not to the checkbox
 * @return {String} Composited checkbox string
 */

function getCheckbox(checked: any) {
  return checked ? chalk.green(figures.radioOn) : figures.radioOff;
}

module.exports = RadioPrompt;
