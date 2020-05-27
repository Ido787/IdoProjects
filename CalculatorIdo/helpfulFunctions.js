export const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

export const removeLastCharFromString = (st) => {
    return st.substring(0, st.length - 1);
}

export const removeThreeLastCharFromString = (st) => {
    return st.substring(0, st.length - 3);
}

export const getLastCharFromString = (st) => {
    return st.charAt(st.length - 1);
}

export const getThirdToLastCharFromString = (st) => {
    return st.charAt(st.length - 3);
}