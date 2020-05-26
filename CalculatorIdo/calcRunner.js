import { canInsertOpenBracket, canInsertCloseBracket, canInsertNum, isOpsOrBrackets } from './regexes.js';
import { isObjectEmpty, removeLastCharFromString } from './helpfulFunctions.js'

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
            console.log(keyPressed);
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
            newButton.addEventListener("click", () => currElement.onClick(currElement.value));
        }
        calcForm.appendChild(newButton);
    });
}

const clearCalculator = () => {
    document.calcForm.input.value = '';
}

const del = () => {
    let currString = document.calcForm.input.value;
    
    // Deleted infinity if needed
    let lastChar = currString.charAt(currString.length - 1);
    currString = (lastChar === 'y') ? '' : removeLastCharFromString(currString);

    document.calcForm.input.value = currString;
}

const insertNumber = (input) => { 
    let resultString = document.calcForm.input.value;
    if(canInsertNum(resultString)) {
        document.calcForm.input.value = document.calcForm.input.value + input;
    }
}

let currOpenBrackets = 0;

const insertOpenBracket = (input) => {
    let resultString = document.calcForm.input.value;
    if(canInsertOpenBracket(resultString)) {
        document.calcForm.input.value = document.calcForm.input.value + input;
        currOpenBrackets++;
    } 
}

const insertCloseBracket = (input) => {
    let resultString = document.calcForm.input.value;
    if(canInsertCloseBracket(resultString) ) {
        if(currOpenBrackets !== 0) {
            currOpenBrackets--;
            document.calcForm.input.value = document.calcForm.input.value + input;
        }
    }
}

const insertDot = (input) => {
    let resultString = document.calcForm.input.value;
    document.calcForm.input.value = document.calcForm.input.value + input;
}

const insertOperator = (input) => {
    let resultString = document.calcForm.input.value;
    document.calcForm.input.value = document.calcForm.input.value + input;
}

const equal = () => {
    let resultString = document.calcForm.input.value;
    if(resultString) {
        let calculatedResult = calculateResult(stringResultToArray(resultString));
        calculatedResult = Math.round(calculatedResult * 100) / 100;
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
            if (currResult === '' && currChar === '-' &&
                !(i > 0 && resultString.charAt(i-1) === ')')) {
                currResult = '-';
            } else {
                if(currChar === '(' ||
                   (isOpsOrBrackets(currChar) && currResult === '')) {
                       resultArray.push(currChar);
                    } else {
                        resultArray.push(parseFloat(currResult), currChar);
                    }
                    currResult = '';
                }
        } else {
            currResult += currChar;
        }
    }
        
        if (currResult !== '') {
            resultArray.push(parseFloat(currResult));
        }
        
        return resultArray;
}
    
const calculateResult = (resultArray) => {
        console.log(resultArray);
        const operators = [{'*': (a, b) => a * b,
                            '/': (a, b) => a / b},
                            {'+': (a, b) => a + b,
                            '-': (a, b) => a - b} ];
        let currResult = [];
        let currentOp;
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
                            resultArray.splice(i, indexOfClosingBracket - i + 1, calculateResult(resultArray.slice(i + 1, indexOfClosingBracket)));
                            break;
                        }
                    } else if(resultArray[j] === '('){
                        openingBracketCounter++;
                    }
                j++;
            }
        }
    }
    
    // Running on the layers of operators
    for (let i = 0; i < operators.length; i++) {
        for (let j = 0; j < resultArray.length; j++) {
            
            // This will be true if the current cell we're on is one
            // of the operators in the current layer
            if (operators[i][resultArray[j]]) {
                currentOp = operators[i][resultArray[j]];
            } else if (currentOp) {
                currResult[currResult.length - 1] = 
                currentOp(currResult[currResult.length - 1], resultArray[j]);
                currentOp = null;
            } else {
                currResult.push(resultArray[j]);
            }
        }
        
        resultArray = currResult;
        currResult = [];
    }
    
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