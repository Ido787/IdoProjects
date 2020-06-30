import { 
  SERVER_IP, 
  USER_CONNECTED_EVENT, 
  GET_LAST_MESSAGE_EVENT, 
  ADD_MESSAGE_EVENT,
  GET_MESSAGES_EVENT,
  SESSION_STORAGE_NAME,
  SESSION_STORAGE_ROOM } from '../clientConsts.js';
import {
  addMeesageToChat,
  addRoomNameToChat,
  scrollToBottom } from '../domManipulationFuncs.js';

const USERNAME = sessionStorage.getItem(SESSION_STORAGE_NAME);
const ROOM_NAME = sessionStorage.getItem(SESSION_STORAGE_ROOM);
const ERROR_MESSAGE = "שגיאה, תנסה להתחבר קודם";
let messagesElement = document.querySelector(".messages");
let inputLineElement = document.querySelector(".input-line");
let titleDivElement = document.querySelector(".title-div");

if(USERNAME === null || ROOM_NAME === null) {
  alert(ERROR_MESSAGE);
  window.location.href = "../loginPage/login.html";
}

let socket = io(SERVER_IP);

socket.on(GET_LAST_MESSAGE_EVENT, message => {
  addMeesageToChat(messagesElement, message);
  scrollToBottom(messagesElement);
});

document.querySelector(".chat-form").addEventListener("submit", sendMessage);
function sendMessage(event) {
  event.preventDefault();
  if(inputLineElement.value.trim()) {
    socket.emit(ADD_MESSAGE_EVENT, {
      name: USERNAME,
      content: inputLineElement.value
    });
    
    inputLineElement.value ='';
  }
}

document.querySelector(".sign-out-button").addEventListener("click", () => {
  window.location.href = "../loginPage/login.html";
});

socket.emit(USER_CONNECTED_EVENT, USERNAME, ROOM_NAME);
socket.on(GET_MESSAGES_EVENT, messages => {
  messages.forEach((message) => {
    addMeesageToChat(messagesElement, message);
  })
  scrollToBottom(messagesElement);
})

addRoomNameToChat(titleDivElement, ROOM_NAME);