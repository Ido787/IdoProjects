window.onload = () => {
    clearCalculator();
}

var currAns = '';
var isResultShown = false;
var isbracketOpen = false;

clearCalculator = () => {
    document.calcForm.input.value = '';
}

del = () => {
    if(isResultShown) {
        isResultShown = false;
        clearCalculator();
    }

    let currString = document.calcForm.input.value;

    // Deleted the whole word if its NaN or Infinity
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


insert = (input) => { 
    let currString = document.calcForm.input.value;
    
    if(isResultShown) {
        isResultShown = false;
        clearCalculator();
    }

    document.calcForm.input.value = document.calcForm.input.value + input;
}

equal = () => {
    if(isResultShown) {
        isResultShown = false;
        clearCalculator();
    }

    let resultString = document.calcForm.input.value;
    if(resultString) {
        let calculatedResult = evaluate(resultString);
        if(calculatedResult === undefined || isNaN(calculatedResult)) {
            alert('Syntax error');
        } else {
            document.calcForm.input.value = calculatedResult;
            currAns = calculatedResult;
            isResultShown = true;
            isDotAvailable = true;
        }
    }
}

stringResultToArray = (resultString) => {
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

calculateResult = (resultArray) => {
    let operators = [{'*': (a, b) => a * b,
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

            // This will be true if there is a one of the ops
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

    if (resultArray.length > 1) {
        return undefined;
    } else {
        return resultArray[0];
    }
}

evaluate = () => {
    let resultString = document.calcForm.input.value;
    return calculateResult(stringResultToArray(resultString));
}