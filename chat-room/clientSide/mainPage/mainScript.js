const SOCKET = io("http://localhost:3000");

let currMessagesNum = 0;
const MSG_ELEMENT = document.getElementById("msgs");
const USERNAME = sessionStorage.getItem('name') ? sessionStorage.getItem('name') : 'חומוס';

window.onload = () => {
  console.log(`ברוך הבא ${USERNAME}`);
  SOCKET.emit("userConnected", USERNAME);
}

SOCKET.on("getMsgs", msgs => {
  buildMsgs(msgs);
  currMessagesNum = msgs.length;
  MSG_ELEMENT.scrollTop = MSG_ELEMENT.scrollHeight - MSG_ELEMENT.clientHeight;
});

const INPUT_LINE = document.getElementById("input-line");

document.getElementById("chat-form").addEventListener("submit", sendMessage);
function sendMessage(event) {
  event.preventDefault();
  if(INPUT_LINE.value) {
    SOCKET.emit("addMsg", {
      name: USERNAME,
      content: INPUT_LINE.value
    });
    INPUT_LINE.value ='';
  }
}

function buildMsgs(msgs) {
  for(let i = currMessagesNum; i < msgs.length; i++) {
    const MSG = msgs[i];
    const NEW_MSG = document.createElement("p");
    const BDI_TEXT = document.createElement("bdi");
    BDI_TEXT.innerHTML = `${MSG.name} : ${MSG.content}`;
    NEW_MSG.appendChild(BDI_TEXT);
    NEW_MSG.setAttribute("class", 'msg');
    MSG_ELEMENT.appendChild(NEW_MSG);
  } 
}

document.getElementById("sign-out-button").addEventListener("click", () => {
  window.location.replace("../loginPage/login.html");
});