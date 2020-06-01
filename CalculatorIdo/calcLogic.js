import { operators } from './operators.js';
import { isOpsOrBrackets } from './regexes.js';
import { getLastCharFromString } from './helpfulFunctions.js';

export const stringResultToArray = (resultString) => {
    let resultArray = [];
    let currResult = '';
    let currChar = '';
    
    for (let i = 0; i < resultString.length; i++) {
        currChar = resultString.charAt(i);
        
        if (isOpsOrBrackets(currChar)) {
            if (currResult === '' && currChar === '-' && 
                !(i > 0 && getLastCharFromString(resultString) === ')')) {
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
    
    if(currResult !== '') {
        resultArray.push(parseFloat(currResult));
    }
    
    return resultArray;
}
    
export const calculateResult = (resultArray) => {
    let indexOfClosingBracket;
    let openingBracketCounter;
    
    resultArray.forEach((currElement, i) => {
        indexOfClosingBracket = -1;
        
        if(currElement === '(') {
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