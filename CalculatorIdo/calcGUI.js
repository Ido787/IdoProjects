import { canInsertOpenBracket, canInsertCloseBracket, canInsertNum, canInsertDot,
         canInsertOperator, canReplaceOperator, canPressEqual, canInsertZero } from './regexes.js';
import { isObjectEmpty, removeLastCharFromString, getLastCharFromString,
         removeThreeLastCharFromString, getThirdToLastCharFromString } from './helpfulFunctions.js';
import { getResult } from './calcLogic.js';

window.onload = () => {
    buildCalc();
}   

const buildCalc = () => {
    let calcForm = document.getElementById('calc-form');
    let newButton;
    PLACEMENT_ARRAY.forEach(currLine => {
        newButton = document.createElement("br");
        calcForm.appendChild(newButton);
        currLine.forEach((currElement) => {
            newButton = document.createElement("input");
            newButton.setAttribute("class", "calc-button");
            newButton.setAttribute("type", "button");
            newButton.setAttribute("value", currElement.value);
            newButton.addEventListener("mousedown", () => currElement.onClick(currElement.value));
            calcForm.appendChild(newButton);
        });
    });
}

const PLACEMENT_ARRAY = [
    [{value: 7, onClick: insertNumber, keys: ['7']},
    {value: 8, onClick: insertNumber, keys: ['8']},
    {value: 9, onClick: insertNumber, keys: ['9']},
    {value: 'DEL', onClick: del, keys: ['Backspace', 'Delete']},
    {value: 'AC', onClick: clearCalculator, keys: ['R', 'r']}],

    [{value: 4, onClick: insertNumber, keys: ['4']},
    {value: 5, onClick: insertNumber, keys: ['5']},
    {value: 6, onClick: insertNumber, keys: ['6']},
    {value: '*', onClick: insertOperator, keys: ['*']},
    {value: '/', onClick: insertOperator, keys: ['/']}],

    [{value: 1, onClick: insertNumber, keys: ['1']},
    {value: 2, onClick: insertNumber, keys: ['2']},
    {value: 3, onClick: insertNumber, keys: ['3']},
    {value: '+', onClick: insertOperator, keys: ['+']},
    {value: '-', onClick: insertOperator, keys: ['-']}],

    [{value: 0, onClick: insertNumber, keys: ['0']},
    {value: '.', onClick: insertDot, keys: ['.']},
    {value: '(', onClick: insertOpenBracket, keys: ['(']},
    {value: ')', onClick: insertCloseBracket, keys: [')']},
    {value: '=', onClick: equal, keys: ['Enter']}]
];

document.onkeyup = (event) => {
    const keyPressed = event.key;
    const CURRENT_VALUE = DICTIONARY[keyPressed];
    if(CURRENT_VALUE) {
        CURRENT_VALUE.onClick(CURRENT_VALUE.value);
    }
}

const INPUT_LINE = document.calcForm.input;

function clearCalculator() {
    INPUT_LINE.value = '';
    currOpenBrackets = 0;
}

function del() {
    let currResult = INPUT_LINE.value;
    let lastChar = getLastCharFromString(currResult);

    lastChar === '(' ? currOpenBrackets-- : '';
    lastChar === ')' ? currOpenBrackets++ : '';

    if(getThirdToLastCharFromString(currResult) === 'e') {
        currResult = removeThreeLastCharFromString(currResult);
    } else {
        currResult = (getLastCharFromString(currResult) === 'y') ? '' : removeLastCharFromString(currResult);   
    }

    INPUT_LINE.value = currResult;
}

function insertNumber(input) {   
    const currResult = INPUT_LINE.value;
    if(currResult!== 'Infinity' && canInsertNum(currResult)) {
        if((input === 0 && canInsertZero(currResult)) || (input !== 0)) {
            INPUT_LINE.value = INPUT_LINE.value + input;
        }
    }
}

let currOpenBrackets = 0;

function insertOpenBracket(input) {
    const currResult = INPUT_LINE.value;
    if(currResult!== 'Infinity' && canInsertOpenBracket(currResult)) {
        INPUT_LINE.value = INPUT_LINE.value + input;
        currOpenBrackets++;
    } 
}

function insertCloseBracket(input) {
    const currResult = INPUT_LINE.value;
    if((currResult!== 'Infinity') &&
       (canInsertCloseBracket(currResult)) &&
       (currOpenBrackets !== 0)) {
            currOpenBrackets--;
            INPUT_LINE.value = INPUT_LINE.value + input;
    }
}

function insertDot(input) {
    const currResult = INPUT_LINE.value;
    if(currResult!== 'Infinity' && canInsertDot(currResult)) {
        INPUT_LINE.value = INPUT_LINE.value + input;
    }
}

function insertOperator(input) {
    let currResult = INPUT_LINE.value;

    if(canInsertOperator(currResult)) {
        INPUT_LINE.value = INPUT_LINE.value + input;
        if(canReplaceOperator(currResult)) {
            currResult = removeLastCharFromString(currResult);
            INPUT_LINE.value = currResult + input;
        }
    }
}

function equal() {
    let result = INPUT_LINE.value;
    if(result && canPressEqual(result) && currOpenBrackets === 0) {
        let calculatedResult = getResult(result);
        calculatedResult = Number(calculatedResult.toFixed(5));
        if(calculatedResult === undefined || isNaN(calculatedResult)) {
            alert('Syntax error');
        } else {
            INPUT_LINE.value = calculatedResult;
        }
    } else {
        alert('Syntax error');
    }
}

function makeDictionary() {
    let dictionary = {};
    PLACEMENT_ARRAY.forEach((currLayer) => {
        currLayer.forEach((currElement) => {
            for(let i = 0; i < currElement.keys.length; i++) {
                dictionary[currElement.keys[i]] = currElement;
            }
        });
    });

    return dictionary;
}

const DICTIONARY = makeDictionary();