let msgs;

async function getMsgs () {
  let res = await fetch('http://localhost:3000/msgs');
  let data = await res.json();
  msgs = data;
}

const USERNAME = sessionStorage.getItem('name') ? sessionStorage.getItem('name') : 'חומוס';

window.onload = async () => {
  await getMsgs();
  buildMsgs();
  console.log(`ברוך הבא ${USERNAME}`);
}   

const INPUT_LINE = document.getElementById("input-line");

document.getElementById("chat-form").addEventListener("submit", sendMessage);
function sendMessage(event) {
  event.preventDefault();
  console.log(INPUT_LINE.value);
  fetch('http://localhost:3000/send', {
    method: 'Post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify("Hello")
  })
  INPUT_LINE.value ='';
}

document.getElementById("sign-out-button").addEventListener("click", disconnect);
function disconnect() {
  window.location.replace('./login.html');
}

function buildMsgs() {
  const msgElement = document.getElementById("msgs");
  msgs.forEach((msg) => {
    console.log()
    let newMsg = document.createElement("p");
    newMsg.innerHTML = `${msg.name} : ${msg.content}`;
    newMsg.setAttribute("class", 'msg');
    msgElement.appendChild(newMsg);
  })
}