import {
    SESSION_STORAGE_NAME,
    LOCAL_STORAGE_ID,
    SERVER_IP,
    IS_NAME_EXISTS_EVENT,
    ADD_NAME_EVENT,
    SESSION_STORAGE_ROOM,
    GET_ROOM_NAMES,
    ADD_ROOM_TO_LIST,
    RESET_DEFAULT_NAME_EVENT } from '../clientConsts.js';
import { addOptionToRoomlist } from '../domManipulationFuncs.js';
    
const AVAILABLE_NAME = sessionStorage.getItem(SESSION_STORAGE_NAME);
const NAME_USED_ERROR_MESSAGE = "שם זה תפוס. בחר/י בבקשה שם אחר";
let nameInputElement = document.querySelector(".name-input");
let roomInputElement = document.querySelector(".room-input");
let socket = io(SERVER_IP);
let newRoomName;

document.querySelector(".login-button").addEventListener("click", (event) => login(event));
document.querySelector(".login-create-button").addEventListener("click", (event) => login(event, true));
document.querySelector(".login-form").addEventListener("submit", event => login(event));

let username;

function login(event, isNewRoom = false) {
    event.preventDefault();
    if(isNewRoom) {
        sessionStorage.setItem(SESSION_STORAGE_ROOM, newRoomName);
    } else {
        sessionStorage.setItem(SESSION_STORAGE_ROOM, roomInputElement.value);
    }

    if(nameInputElement.value.trim()) {
        username = nameInputElement.value;
    } else {
        const currLocalStorageId = localStorage.getItem(LOCAL_STORAGE_ID);
        username = `חומוס ${currLocalStorageId}`;
        localStorage.setItem(LOCAL_STORAGE_ID, parseInt(currLocalStorageId) + 1);
    }
    
    socket.emit(IS_NAME_EXISTS_EVENT, username);
}

socket.on(IS_NAME_EXISTS_EVENT, isNameExist => {
    if(isNameExist) {
        alert(NAME_USED_ERROR_MESSAGE);
    } else {
        socket.emit(ADD_NAME_EVENT, username);
        sessionStorage.setItem(SESSION_STORAGE_NAME , username);
        window.location.href = "../mainPage/main.html";
    }
})

socket.on(ADD_ROOM_TO_LIST, roomName => {
    addOptionToRoomlist(roomInputElement, roomName);
    newRoomName = `${newRoomName.substring(0, 5)}${parseInt(newRoomName.substring(5, newRoomName.length)) + 1}`;
});

socket.on(GET_ROOM_NAMES, roomNames => {
    roomNames.forEach(roomName => addOptionToRoomlist(roomInputElement, roomName));
    newRoomName = `Room ${roomNames.length}`;
});

if(AVAILABLE_NAME) {
    nameInputElement.value = AVAILABLE_NAME;
}

socket.on(RESET_DEFAULT_NAME_EVENT, () => {
    localStorage.setItem(LOCAL_STORAGE_ID, 1);
})