export function addOptionToRoomlist(element, roomName) {
    let newOption = document.createElement("option");
    newOption.innerText = roomName;
    newOption.setAttribute('value', roomName);
    element.appendChild(newOption);
}

export function addMeesageToChat(element, message) {
    let newMessage = document.createElement("p");
    let bdiText = document.createElement("bdi");
    bdiText.innerText = `${message.name} : ${message.content}`;
    newMessage.appendChild(bdiText);
    newMessage.classList.add("message");
    element.appendChild(newMessage);
}

export function addRoomNameToChat(element, roomName) {
    let roomNameElement = document.createElement("h2");
    roomNameElement.setAttribute('id', 'room-name');
    roomNameElement.innerText = roomName;
    element.appendChild(roomNameElement);
}

export function scrollToBottom (element) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
}