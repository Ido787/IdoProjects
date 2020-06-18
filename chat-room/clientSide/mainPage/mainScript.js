import { 
  SERVER_IP, 
  USER_CONNECTED_EVENT, 
  GET_LAST_MESSAGE_EVENT, 
  ADD_MESSAGE_EVENT,
  GET_MESSAGES_EVENT,
  SESSION_STORAGE_NAME } from '../clientConsts.js';

const SOCKET = io(SERVER_IP);

const USERNAME = sessionStorage.getItem(SESSION_STORAGE_NAME);
const MESSAGES_ELEMENT = document.getElementById("messages");
const INPUT_LINE = document.getElementById("input-line");

function scrollToBottom () {
  INPUT_LINE.scrollTop = INPUT_LINE.scrollHeight - INPUT_LINE.clientHeight;
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

console.log(`ברוך הבא ${USERNAME}`);
SOCKET.emit(USER_CONNECTED_EVENT, USERNAME);
SOCKET.on(GET_MESSAGES_EVENT, messages => {
  messages.forEach((message) => {
    addMeesageToChat(message);
  })
  scrollToBottom();
})