export const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

export const removeLastCharFromString = (st) => {
    return st.substring(0, st.length - 1);
}