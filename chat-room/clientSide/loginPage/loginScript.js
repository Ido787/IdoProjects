import {
    SESSION_STORAGE_NAME,
    LOCAL_STORAGE_ID,
    SERVER_IP } from '../clientConsts.js';

const INPUT_LINE = document.getElementById("input-line");
const SOCKET = io(SERVER_IP);

document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("login-button").addEventListener("click", login);

function login(event) {
    event.preventDefault();
    let username;

    if(INPUT_LINE.value.trim()) {
        username = INPUT_LINE.value;
    } else {
        const currLocalStorageId = localStorage.getItem(LOCAL_STORAGE_ID);
        username = `חומוס ${currLocalStorageId}`;
        localStorage.setItem(LOCAL_STORAGE_ID, parseInt(currLocalStorageId) + 1);
    }
    
    let isNameExist = false;
    SOCKET.emit("getNames");
    SOCKET.on("getNames", names => {
        names.forEach((name) => {
            name === username ? isNameExist = true : '';
            console.log(name);
        })
        if(isNameExist) {
            alert("Plase pick an original name");
        } else {
            SOCKET.emit("addName", username);
            sessionStorage.setItem(SESSION_STORAGE_NAME , username);
            window.location.href = "../mainPage/main.html";
        }
    })
}