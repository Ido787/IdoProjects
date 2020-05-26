export const isOpsOrBrackets = (char) => {
     return /^[)(*/+-]$/.test(char);
};

export const canInsertNum = (st) => {
     return /.*(?<!\))$/.test(st);
}

export const canInsertOpenBracket = (st) => {
     return /.*(?<!\d|\)|\.)$/.test(st);
}

export const canInsertCloseBracket = (st) => {
     const reg = new RegExp(`.+(?<![${operations}\(])$`)
     return reg.test(st);
}

export const canInsertOperator = (st) => {
     return /a/.test(st);
}

export const canInsertDot = (st) => {
     return /a/.test(st);
}

const operations = '+\\-*/';