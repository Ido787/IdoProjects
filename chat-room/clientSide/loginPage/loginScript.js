import {
    SESSION_STORAGE_NAME,
    LOCAL_STORAGE_ID,
    SERVER_IP,
    IS_NAME_EXISTS_EVENT,
    ADD_NAME_EVENT } from '../clientConsts.js';

const INPUT_LINE = document.getElementById("input-line");
const SOCKET = io(SERVER_IP);

document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("login-button").addEventListener("click", login);

let username;

function login(event) {
    event.preventDefault();

    if(INPUT_LINE.value.trim()) {
        username = INPUT_LINE.value;
    } else {
        const currLocalStorageId = localStorage.getItem(LOCAL_STORAGE_ID);
        username = `חומוס ${currLocalStorageId}`;
        localStorage.setItem(LOCAL_STORAGE_ID, parseInt(currLocalStorageId) + 1);
    }
    
    SOCKET.emit(IS_NAME_EXISTS_EVENT, username);
}

SOCKET.on(IS_NAME_EXISTS_EVENT, isNameExist => {
    if(isNameExist) {
        alert("Plase pick an original name");
    } else {
        SOCKET.emit(ADD_NAME_EVENT, username);
        sessionStorage.setItem(SESSION_STORAGE_NAME , username);
        window.location.href = "../mainPage/main.html";
    }
}) 