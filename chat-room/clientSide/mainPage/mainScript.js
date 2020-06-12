const socket = io("http://localhost:3000");

let msgs;
let currMessagesNum = 0;
const MSG_ELEMENT = document.getElementById("msgs");
const USERNAME = sessionStorage.getItem('name') ? sessionStorage.getItem('name') : 'חומוס';

socket.on("getMsgs", MSGS => {
  msgs = MSGS;
  buildMsgs();
  currMessagesNum = msgs.length;
  MSG_ELEMENT.scrollTop = MSG_ELEMENT.scrollHeight - MSG_ELEMENT.clientHeight;
});

window.onload = () => {
  console.log(`ברוך הבא ${USERNAME}`);
  socket.emit("userConnected", USERNAME);
}

const INPUT_LINE = document.getElementById("input-line");

document.getElementById("chat-form").addEventListener("submit", sendMessage);
function sendMessage(event) {
  event.preventDefault();
  if(INPUT_LINE.value) {
    socket.emit("addMsg", {
      name: USERNAME,
      content: INPUT_LINE.value
    });
    INPUT_LINE.value ='';
  }
}

function buildMsgs() {
  const msgElement = document.getElementById("msgs");
  for(let i = currMessagesNum; i < msgs.length; i++) {
    let msg = msgs[i];
    let newMsg = document.createElement("p");
    let bdiText = document.createElement("bdi");
    bdiText.innerHTML = `${msg.name} : ${msg.content}`;
    newMsg.appendChild(bdiText);
    newMsg.setAttribute("class", 'msg');
    msgElement.appendChild(newMsg);
  } 
}

document.getElementById("sign-out-button").addEventListener("click", () => {
  window.location.replace("../loginPage/login.html");
});