import { operatorsString } from './operators.js'

export const isOpsOrBrackets = (char) => {
     const reg = new RegExp(`^[)(${operatorsString}]$`)
     return reg.test(char);
};

export const canInsertNum = (st) => {
     const reg = new RegExp(`.*(?<!\\))$`)
     return reg.test(st);
}

export const canInsertOpenBracket = (st) => {
     const reg = new RegExp(`.*(?<!\\d|\\)|\\.)$`);
     return reg.test(st);
}

export const canInsertCloseBracket = (st) => {
     const reg = new RegExp(`.+(?<![${operatorsString}\(\\.])$`);
     return reg.test(st);
}

export const canInsertOperator = (st) => {
     const reg = new RegExp(`.+(?<!\\(|\\.)$`);
     return reg.test(st);
}

export const canReplaceOperator = (st) => {
     const reg = new RegExp(`.+([${operatorsString}])$`);
     return reg.test(st);
}

export let canInsertDot = (st) => {
     let reg = new RegExp(`.*([${operatorsString}]*)(\\d*)(\\.{1})(\\d*)$|[)]$`);
     return !reg.test(st);
}

export let canPressEqual = (st) => {
     const reg = new RegExp(`.*(?<![${operatorsString}]|\\.|\\()$`);
     return reg.test(st);
}

export let canInsertZero = (st) => {
     const reg = new RegExp(`^([0]+)$`);
     return !reg.test(st);
}