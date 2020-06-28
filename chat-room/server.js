const {
     PORT,
     SERVER_IP,
     USER_CONNECTED_EVENT,
     GET_LAST_MESSAGE_EVENT,
     ADD_MESSAGE_EVENT,
     GET_MESSAGES_EVENT,
     IS_NAME_EXISTS_EVENT,
     ADD_NAME_EVENT,
     GET_ROOM_NAMES,
     ADD_ROOM_TO_LIST,
     RESET_DEFAULT_NAME_EVENT } = require('./serverConsts.js');
const EXPRESS = require('express');
const APP = EXPRESS();

const SERVER = APP.listen(PORT, () => console.log(`Chat is LIVE at ${SERVER_IP}`));

const IO = require('socket.io')(SERVER);

const NAMES = [
];

const ROOMS = {
    'Default room': []
};

let isDefaultNameReset = false;

IO.on("connection", socket => {
    let currRoom;
    let currUsername;

    if(!isDefaultNameReset) {
        socket.emit(RESET_DEFAULT_NAME_EVENT);
        isDefaultNameReset = true;
    }

    socket.on(USER_CONNECTED_EVENT, (username, room) => {
        console.log(`${reverseIfHebrew(username)} connected`);
        if(!ROOMS.hasOwnProperty(room)) {
            ROOMS[room] = [];
            const ROOM_NAMES = Object.keys(ROOMS);
            IO.emit(ADD_ROOM_TO_LIST, ROOM_NAMES[ROOM_NAMES.length - 1]);
        }
        socket.join(room);
        socket.emit(GET_MESSAGES_EVENT, ROOMS[room]);
        currUsername = username;
        currRoom = room;
    })

    socket.on(GET_LAST_MESSAGE_EVENT, () => {
        let currMsgs = ROOMS[currRoom];
        socket.emit(GET_LAST_MESSAGE_EVENT, currMsgs[currMsgs.length - 1]);
    })

    socket.on(ADD_MESSAGE_EVENT, message => {
        console.log(`Added ${reverseIfHebrew(message.name)}'s message: ${reverseIfHebrew(message.content)}`);
        let currMsgs = ROOMS[currRoom];
        currMsgs.push(message);
        IO.to(currRoom).emit(GET_LAST_MESSAGE_EVENT, currMsgs[currMsgs.length - 1]);
    })
    
    socket.on(IS_NAME_EXISTS_EVENT, name => {
        socket.emit(IS_NAME_EXISTS_EVENT, NAMES.includes(name));
    })

    socket.on(ADD_NAME_EVENT, name => {
        NAMES.push(name);
    })

    socket.emit(GET_ROOM_NAMES, Object.keys(ROOMS));

    socket.on("disconnect", () => {
        if(currUsername) {
            const INDEX = NAMES.indexOf(currUsername);
            if(INDEX > - 1) {
                NAMES.splice(INDEX, 1);
            }
            socket.leave(currRoom);
        }
    })
})

function reverseIfHebrew(st) {
    return /[\u0590-\u05fe]/.test(st) ? st.split("").reverse().join("") : st;
}