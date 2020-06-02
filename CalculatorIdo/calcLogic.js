import { operators } from './operators.js';
import { isOpsOrBrackets } from './regexes.js';
import { getLastCharFromString } from './helpfulFunctions.js';

export const getResult = (result) => {
    return calculateResult(parseResult(result));
}

const parseResult = (stringResult) => {
    let resultArray = [];
    let currResult = '';
    let currChar = '';
    
    for (let i = 0; i < stringResult.length; i++) {
        currChar = stringResult.charAt(i);
        
        if (isOpsOrBrackets(currChar)) {
            if (currResult === '' && currChar === '-' && 
                !(i > 0 && getLastCharFromString(stringResult) === ')')) {
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
                currResult += stringResult.charAt(i + 1);
                i++;
            }
        }
    }
    
    if(currResult !== '') {
        resultArray.push(parseFloat(currResult));
    }
    
    return resultArray;
}
    
const calculateResult = (resultArray) => {
    let indexOfClosingBracket;
    let openingBracketCounter;
    
    resultArray.forEach((currElement, i) => {
        indexOfClosingBracket = -1;
        
        if(currElement === '(') {
            openingBracketCounter = 1;
            let j = i + 1;
            let isFound = false;
            for(let j = i + 1; (j < resultArray.length) && (!isFound); j++) {
                if(resultArray[j] === ')') {
                    openingBracketCounter--;
                    indexOfClosingBracket = j;
                    if(openingBracketCounter === 0) {
                        let bracketsContents = resultArray.slice(i + 1, indexOfClosingBracket);
                        resultArray.splice(i, indexOfClosingBracket - i + 1, calculateResult(bracketsContents));
                        isFound = true;
                    }
                } else if(resultArray[j] === '(') {
                    openingBracketCounter++;
                }
            }
        }
    });
        
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