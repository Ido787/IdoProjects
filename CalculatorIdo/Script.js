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
    try {
        let resultString = document.calcForm.input.value;
        if(resultString) {
            let calculatedResult = eval(resultString);
            document.calcForm.input.value = calculatedResult;
            currAns = calculatedResult;
            isResultShown = true;
            isDotAvailable = true;
        }
    }
    catch(err) {
        alert(err.message);
    }
}