import { operators, operatorsString } from './operators.js';
import { canInsertOpenBracket, canInsertCloseBracket, canInsertNum, canInsertDot,
         isOpsOrBrackets, canInsertOperator, canReplaceOperator, canPressEqual } from './regexes.js';
import { isObjectEmpty, removeLastCharFromString, getLastCharFromString,
         removeThreeLastCharFromString, getThirdToLastCharFromString } from './helpfulFunctions.js';

window.onload = () => {
    buildCalc();
}

document.onkeyup = (event) => {
    let keyPressed = event.key;
    keyPressed === 'Backspace' || keyPressed === 'Delete' ? keyPressed = 'DEL' : '';
    keyPressed === 'Enter' ? keyPressed = '=' : '';
    keyPressed === 'r' || keyPressed === 'R' ? keyPressed = 'AC' : '';
    placementArray.forEach((currElement) => {
        if(!isObjectEmpty(currElement) && keyPressed === currElement.value.toString()) {
            currElement.onClick(currElement.value);
        }
    })
}

const buildCalc = () => {
    let calcForm = document.getElementsByClassName('calc-form')[0];
    let newButton;
    placementArray.forEach(currElement => {
        if(isObjectEmpty(currElement)) {
            newButton = document.createElement("br");
        } else {
            newButton = document.createElement("input");
            newButton.setAttribute("class", "calc-button");
            newButton.setAttribute("type", "button");
            newButton.setAttribute("value", currElement.value);
            newButton.addEventListener("mousedown", () => currElement.onClick(currElement.value));
        }
        calcForm.appendChild(newButton);
    });
}

const clearCalculator = () => {
    document.calcForm.input.value = '';
    currOpenBrackets = 0;
}

const del = () => {
    let currString = document.calcForm.input.value;
    
    getLastCharFromString(currString) === '(' ? currOpenBrackets-- : '';
    getLastCharFromString(currString) === ')' ? currOpenBrackets++ : '';

    if(getThirdToLastCharFromString(currString) === 'e') {
        currString = removeThreeLastCharFromString(currString);
    } else {
        // Deleted infinity if needed
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
        calculatedResult = Math.round(calculatedResult * 1000) / 1000;
        if(calculatedResult === undefined || isNaN(calculatedResult)) {
            alert('Syntax error');
        } else {
            document.calcForm.input.value = calculatedResult;
        }
    }
}

const stringResultToArray = (resultString) => {
    let resultArray = [];
    let currResult = '';
    let currChar = '';
    
    for (let i = 0; i < resultString.length; i++) {
        currChar = resultString.charAt(i);
        
        if (isOpsOrBrackets(currChar)) {
            if (currChar === '-' && !(i > 0 && getLastCharFromString(resultString) === ')')) {
                currResult = '-';
            } else {
                if(currChar === '(' || currResult === '') {
                       resultArray.push(currChar);
                } else {
                    resultArray.push(parseFloat(currResult), currChar);
                }
                currResult = '';
            }
        } else {
            currResult += currChar;
            if(currChar === 'e') {
                currResult += resultString.charAt(i + 1);
                i++;
            }
        }
    }
        
    if (currResult !== '') {
        resultArray.push(parseFloat(currResult));
    }
    return resultArray;
}
    
const calculateResult = (resultArray) => {
    let indexOfClosingBracket;
    let openingBracketCounter;
    
    // Calculating the equations in brackets first
    for(let i = 0; i < resultArray.length - 1; i++) {
        indexOfClosingBracket = -1;
        
        if(resultArray[i] === '(') {
            let j = i + 1;
            openingBracketCounter = 1;
            
            while(j!== resultArray.length) {
                if(resultArray[j] === ')') {
                    openingBracketCounter--;
                    indexOfClosingBracket = j;
                    if(openingBracketCounter === 0) {
                        let bracketsContents = resultArray.slice(i + 1, indexOfClosingBracket);
                        resultArray.splice(i, indexOfClosingBracket - i + 1, calculateResult(bracketsContents));
                        break;
                    }
                } else if(resultArray[j] === '(') {
                    openingBracketCounter++;
                }
                
                j++;
            }
        }
    }
        
    let currResult = [];
    let currentOp;
    
    operators.forEach((operatorLayer) => {
        resultArray.forEach((currElement) => {
            if (operatorLayer[currElement]) {
                currentOp = operatorLayer[currElement];
            } else if (currentOp) {
                currResult[currResult.length - 1] = 
                    currentOp(currResult[currResult.length - 1], currElement);
                currentOp = null;
            } else {
                currResult.push(currElement);
            }
        })

        resultArray = currResult;
        currResult = [];
    })

    return resultArray.length > 1 ? undefined : resultArray[0];
}

const placementArray = [
    {},
    {value: 7, onClick: insertNumber},
    {value: 8, onClick: insertNumber},
    {value: 9, onClick: insertNumber},
    {value: 'DEL', onClick: del},
    {value: 'AC', onClick: clearCalculator},
    {},
    {value: 4, onClick: insertNumber},
    {value: 5, onClick: insertNumber},
    {value: 6, onClick: insertNumber},
    {value: '*', onClick: insertOperator},
    {value: '/', onClick: insertOperator},
    {},
    {value: 1, onClick: insertNumber},
    {value: 2, onClick: insertNumber},
    {value: 3, onClick: insertNumber},
    {value: '+', onClick: insertOperator},
    {value: '-', onClick: insertOperator},
    {},
    {value: 0, onClick: insertNumber},
    {value: '.', onClick: insertDot},
    {value: '(', onClick: insertOpenBracket},
    {value: ')', onClick: insertCloseBracket},
    {value: '=', onClick: equal},
];