import { operatorsString } from './operators.js'

export const isOpsOrBrackets = (char) => {
     const reg = new RegExp(`^[)(${operatorsString}]$`)
     return reg.test(char);
};

export const canInsertNum = (st) => {
     return /.*(?<!\))$/.test(st);
}

export const canInsertOpenBracket = (st) => {
     return /.*(?<!\d|\)|\.)$/.test(st);
}

export const canInsertCloseBracket = (st) => {
     const reg = new RegExp(`.+(?<![${operatorsString}\(\\.])$`);
     return reg.test(st);
}

export const canInsertOperator = (st) => {
     return /.+(?<!\()$/.test(st);
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