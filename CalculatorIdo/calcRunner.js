window.onload = () => {
    buildCalc();
}

document.onkeyup = (event) => {
    let keyPressed = event.key;
    placementArray.forEach((currElement) => {
        keyPressed === 'Backspace' || keyPressed === 'Delete' ? keyPressed = 'DEL' : '';
        keyPressed === 'Enter' ? keyPressed = '=' : '';
        if(keyPressed == currElement.value) {
            currElement.onClick(keyPressed);
        }
    })
}

let buildCalc = () => {
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

let isResultShown = false;
let isOpenBracketAvailable = true;
let isCloseBracketAvailable = false;
let isNumberAvailable = true;
let isOperandAvailable = false;

let clearCalculator = () => {
    document.calcForm.input.value = '';
    isResultShown = false;
}

let del = () => {
    let currString = document.calcForm.input.value;
    
    // Deleted the whole word if its a word
    if(/^[a-zA-Z]+$/.test(currString.charAt(currString.length - 1))) {
        document.calcForm.input.value = currString.substring(0, currString.length - 1);
        currString = document.calcForm.input.value;

        while((/^[a-zA-Z]+$/.test(currString.charAt(currString.length - 1)))) {
            document.calcForm.input.value = currString.substring(0, currString.length - 1);
            currString = document.calcForm.input.value;
        }
    } else {
        document.calcForm.input.value = currString.substring(0, currString.length - 1);
    }
}

let insert = (input) => { 
    document.calcForm.input.value = document.calcForm.input.value + input;
}

let equal = () => {
    let resultString = document.calcForm.input.value;
    if(resultString) {
        let calculatedResult = calculateResult(stringResultToArray(resultString));
        calculatedResult = Math.round(calculatedResult * 100) / 100;
        if(calculatedResult === undefined || isNaN(calculatedResult)) {
            alert('Syntax error');
            console.log('An error has occurred');
        } else {
            document.calcForm.input.value = calculatedResult;
            isResultShown = true;
        }
    }
}

let stringResultToArray = (resultString) => {
    let resultArray = [];
    let currResult = '';
    let currChar = '';
    
    for (let i = 0; i < resultString.length; i++) {
        currChar = resultString.charAt(i);
        
        if (/^[)(*/+-]$/.test(currChar)) {
            if (currResult === '' && currChar === '-' &&
            !(i > 0 && resultString.charAt(i-1) === ')')) {
                currResult = '-';
            } else {
                if(currChar === '(' ||
                   (/^[)*/+-]$/.test(currChar) && currResult === '')) {
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
    
    let calculateResult = (resultArray) => {
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
    {value: 7, onClick: insert},
    {value: 8, onClick: insert},
    {value: 9, onClick: insert},
    {value: 'DEL', onClick: del},
    {value: 'AC', onClick: clearCalculator},
    {},
    {value: 4, onClick: insert},
    {value: 5, onClick: insert},
    {value: 6, onClick: insert},
    {value: '*', onClick: insert},
    {value: '/', onClick: insert},
    {},
    {value: 1, onClick: insert},
    {value: 2, onClick: insert},
    {value: 3, onClick: insert},
    {value: '+', onClick: insert},
    {value: '-', onClick: insert},
    {},
    {value: 0, onClick: insert},
    {value: '.', onClick: insert},
    {value: '(', onClick: insert},
    {value: ')', onClick: insert},
    {value: '=', onClick: equal},
];

let isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}