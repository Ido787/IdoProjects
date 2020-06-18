const {
     PORT,
     SERVER_IP,
     USER_CONNECTED_EVENT,
     GET_LAST_MESSAGE_EVENT,
     ADD_MESSAGE_EVENT,
     GET_MESSAGES_EVENT,
     IS_NAME_EXISTS_EVENT,
     ADD_NAME_EVENT
    } = require('./serverConsts.js');
const EXPRESS = require('express');
const APP = EXPRESS();

const SERVER = APP.listen(PORT, () => console.log(`Chat is LIVE at ${SERVER_IP}`));

const IO = require('socket.io')(SERVER);

const MESSAGES = [
];

const NAMES = [
];

IO.on("connection", socket => {
    socket.on(USER_CONNECTED_EVENT, username => {
        console.log(`${reverseIfHebrew(username)} connected`);
        socket.emit(GET_MESSAGES_EVENT, MESSAGES);
    })

    socket.on(GET_LAST_MESSAGE_EVENT, () => {
        socket.emit(GET_LAST_MESSAGE_EVENT, MESSAGES[MESSAGES.length - 1]);
    })

    socket.on(ADD_MESSAGE_EVENT, message => {
        console.log(`Added ${reverseIfHebrew(message.name)}'s message: ${reverseIfHebrew(message.content)}`);
        MESSAGES.push(message);
        IO.emit(GET_LAST_MESSAGE_EVENT, MESSAGES[MESSAGES.length - 1]);
    })
    
    socket.on(IS_NAME_EXISTS_EVENT, name => {
        socket.emit(IS_NAME_EXISTS_EVENT, NAMES.includes(name));
    })

    socket.on(ADD_NAME_EVENT, name => {
        NAMES.push(name);
    })
})

function reverseIfHebrew(st) {
    return /[\u0590-\u05fe]/.test(st) ? st.split("").reverse().join("") : st;
}