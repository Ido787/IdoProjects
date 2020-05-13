window.onload = () => {
    clearCalculator();
}

var currAns = '';
var isResultShown = false;

clearCalculator = () => {
    document.calcForm.input.value = '';
}

del = () => {
    if(isResultShown) {
        isResultShown = false;
        clearCalculator();
    }

    let currString = document.calcForm.input.value;
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

var isDotAvailable = true;

insert = (input) => { 
    let currString = document.calcForm.input.value;
    
    if(isResultShown) {
        isResultShown = false;
        clearCalculator();
    }

    if(!(!currString && /^[*/+.]+$/.test(input))) {        

        // Make sure a number like 2.2.2 can't be put
        if((/^[-*/+]+$/.test(input) && !isDotAvailable)) {
            isDotAvailable = true;
        }
    
        if(!(input === '.' && !isDotAvailable)) {
            if(!((/^[-*/+.]+$/.test(input)) && /^[-*/+.]+$/.test(currString.charAt(currString.length - 1)))) {
                if(input === '.' && isDotAvailable) {
                    isDotAvailable = false;
                }
                document.calcForm.input.value = document.calcForm.input.value + input;
            }
        }
    }
}

equal = () => {
    if(isResultShown) {
        isResultShown = false;
        clearCalculator();
    }

    let resultString = document.calcForm.input.value;
    if(resultString) {
        let calculatedResult = eval(resultString);
        document.calcForm.input.value = calculatedResult;
        currAns = calculatedResult;
        isResultShown = true;
        isDotAvailable = true;
    }
}