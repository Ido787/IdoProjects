import { 
  SERVER_IP, 
  USER_CONNECTED_EVENT, 
  GET_LAST_MESSAGE_EVENT, 
  ADD_MESSAGE_EVENT,
  GET_MESSAGES_EVENT,
  SESSION_STORAGE_NAME
 } from '../clientConsts.js';

const SOCKET = io(SERVER_IP);
const USERNAME = sessionStorage.getItem(SESSION_STORAGE_NAME);
const ROOM_NAME = sessionStorage.getItem('room');
const MESSAGES_ELEMENT = document.getElementById("messages");
const INPUT_LINE = document.getElementById("input-line");
const TITLE_DIV = document.getElementById("title-div");

function scrollToBottom () {
  MESSAGES_ELEMENT.scrollTop = MESSAGES_ELEMENT.scrollHeight - MESSAGES_ELEMENT.clientHeight;
}

function addMeesageToChat(message) {
  const NEW_MESSAGE = document.createElement("p");
  const BDI_TEXT = document.createElement("bdi");
  BDI_TEXT.innerHTML = `${message.name} : ${message.content}`;
  NEW_MESSAGE.appendChild(BDI_TEXT);
  NEW_MESSAGE.classList.add("message");
  MESSAGES_ELEMENT.appendChild(NEW_MESSAGE);
}

SOCKET.on(GET_LAST_MESSAGE_EVENT, message => {
  addMeesageToChat(message);
  scrollToBottom();
});

document.getElementById("chat-form").addEventListener("submit", sendMessage);
function sendMessage(event) {
  event.preventDefault();
  if(INPUT_LINE.value.trim()) {
    SOCKET.emit(ADD_MESSAGE_EVENT, {
      name: USERNAME,
      content: INPUT_LINE.value
    });
    INPUT_LINE.value ='';
  }
}

document.getElementById("sign-out-button").addEventListener("click", () => {
  window.location.href = "../loginPage/login.html";
});

SOCKET.emit(USER_CONNECTED_EVENT, USERNAME, ROOM_NAME);
SOCKET.on(GET_MESSAGES_EVENT, messages => {
  messages.forEach((message) => {
    addMeesageToChat(message);
  })
  scrollToBottom();
})

const ROOM_NAME_ELEMENT = document.createElement("h2");
ROOM_NAME_ELEMENT.setAttribute('id', 'room-name');
ROOM_NAME_ELEMENT.innerText = ROOM_NAME;
TITLE_DIV.appendChild(ROOM_NAME_ELEMENT);