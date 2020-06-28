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
    
const AVAILABLE_NAME = sessionStorage.getItem(SESSION_STORAGE_NAME);
const NAME_INPUT = document.getElementById("name-input");
const ROOM_INPUT = document.getElementById("room-input");
const SOCKET = io(SERVER_IP);
let newRoomName;
let isNewRoom = false;

document.getElementById("login-button").addEventListener("click", login);
document.getElementById("login-create-button").addEventListener("click", markNewRoom);
document.getElementById("login-form").addEventListener("submit", event => login(event));

let username;

function addOptionToRoomlist(roomName) {
    const NEW_OPTION = document.createElement("option");
    NEW_OPTION.innerText = roomName;
    NEW_OPTION.setAttribute('value', roomName);
    ROOM_INPUT.appendChild(NEW_OPTION);
}

function markNewRoom(event) {
    event.preventDefault();
    isNewRoom = true;
    login(event);
}

function login(event) {
    event.preventDefault();
    if(isNewRoom) {
        isNewRoom = false;
        sessionStorage.setItem(SESSION_STORAGE_ROOM, newRoomName);
    } else {
        sessionStorage.setItem(SESSION_STORAGE_ROOM, ROOM_INPUT.value);
    }

    if(NAME_INPUT.value.trim()) {
        username = NAME_INPUT.value;
    } else {
        const currLocalStorageId = localStorage.getItem(LOCAL_STORAGE_ID);
        username = `חומוס ${currLocalStorageId}`;
        localStorage.setItem(LOCAL_STORAGE_ID, parseInt(currLocalStorageId) + 1);
    }
    
    SOCKET.emit(IS_NAME_EXISTS_EVENT, username);
}

SOCKET.on(IS_NAME_EXISTS_EVENT, isNameExist => {
    if(isNameExist) {
        alert("שם זה תפוס. בחר/י בבקשה שם אחר");
    } else {
        SOCKET.emit(ADD_NAME_EVENT, username);
        sessionStorage.setItem(SESSION_STORAGE_NAME , username);
        window.location.href = "../mainPage/main.html";
    }
})

SOCKET.on(ADD_ROOM_TO_LIST, roomName => {
    addOptionToRoomlist(roomName);
    newRoomName = `${newRoomName.substring(0, 5)}${parseInt(newRoomName.substring(5, newRoomName.length)) + 1}`;
});

SOCKET.on(GET_ROOM_NAMES, roomNames => {
    roomNames.forEach(roomName => addOptionToRoomlist(roomName));
    newRoomName = `Room ${roomNames.length}`;
});

if(AVAILABLE_NAME) {
    NAME_INPUT.value = AVAILABLE_NAME;
}

SOCKET.on(RESET_DEFAULT_NAME_EVENT, () => {
    localStorage.setItem(LOCAL_STORAGE_ID, 1);
})