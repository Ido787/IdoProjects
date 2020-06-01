import { canInsertOpenBracket, canInsertCloseBracket, canInsertNum, canInsertDot,
         canInsertOperator, canReplaceOperator, canPressEqual } from './regexes.js';
import { isObjectEmpty, removeLastCharFromString, getLastCharFromString,
         removeThreeLastCharFromString, getThirdToLastCharFromString } from './helpfulFunctions.js';
import { stringResultToArray, calculateResult } from './calcLogic.js';

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

document.onkeyup = (event) => {
    let keyPressed = event.key;
    const CURRENT_VALUE = DICTIONARY[keyPressed];
    if(CURRENT_VALUE) {
        CURRENT_VALUE.onClick(CURRENT_VALUE.value);
    }
    // enter doesn't work
}

const clearCalculator = () => {
    document.calcForm.input.value = '';
    currOpenBrackets = 0;
}

const del = () => {
    let currString = document.calcForm.input.value;
    let lastChar = getLastCharFromString(currString);

    lastChar === '(' ? currOpenBrackets-- : '';
    lastChar === ')' ? currOpenBrackets++ : '';

    if(getThirdToLastCharFromString(currString) === 'e') {
        currString = removeThreeLastCharFromString(currString);
    } else {
        currString = (getLastCharFromString(currString) === 'y') ? '' : removeLastCharFromString(currString);   
    }

    document.calcForm.input.value = currString;
}

const insertNumber = (input) => {   
    const resultString = document.calcForm.input.value;
    if(resultString!== 'Infinity' && canInsertNum(resultString)) {
        document.calcForm.input.value = document.calcForm.input.value + input;
    }
}

let currOpenBrackets = 0;

const insertOpenBracket = (input) => {
    const resultString = document.calcForm.input.value;
    if(resultString!== 'Infinity' && canInsertOpenBracket(resultString)) {
        document.calcForm.input.value = document.calcForm.input.value + input;
        currOpenBrackets++;
    } 
}

const insertCloseBracket = (input) => {
    const resultString = document.calcForm.input.value;
    if((resultString!== 'Infinity') &&
       (canInsertCloseBracket(resultString)) &&
       (currOpenBrackets !== 0)) {
            currOpenBrackets--;
            document.calcForm.input.value = document.calcForm.input.value + input;
    }
}

const insertDot = (input) => {
    const resultString = document.calcForm.input.value;
    if(resultString!== 'Infinity' && canInsertDot(resultString)) {
        document.calcForm.input.value = document.calcForm.input.value + input;
    }
}

const insertOperator = (input) => {
    let resultString = document.calcForm.input.value;

    if(canInsertOperator(resultString)) {
        document.calcForm.input.value = document.calcForm.input.value + input;
        if(canReplaceOperator(resultString)) {
            resultString = removeLastCharFromString(resultString);
            document.calcForm.input.value = resultString + input;
        }
    }
}

const equal = () => {
    let resultString = document.calcForm.input.value;
    if(resultString && canPressEqual(resultString) && currOpenBrackets === 0) {
        let calculatedResult = calculateResult(stringResultToArray(resultString));
        calculatedResult = Number(calculatedResult.toFixed(5));
        if(calculatedResult === undefined || isNaN(calculatedResult)) {
            alert('Syntax error');
        } else {
            document.calcForm.input.value = calculatedResult;
        }
    } else {
        alert('Syntax error');
    }
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
    {value: '=', onClick: equal, keys: ['=']}]
];

const makeDictionary = () => {
    let dictionary = {};
    PLACEMENT_ARRAY.forEach((currLayer) => {
        currLayer.forEach((currElement) => {
            for(let i = 0; i < currElement.keys.length; i++) {
                dictionary[currElement.keys[i]] = currElement;
            }
        });
        //dictionary[key] = value which is the whole element;
        //dictionary[key].onClick(dictionary[key].value)
    });

    return dictionary;
}

const DICTIONARY = makeDictionary();