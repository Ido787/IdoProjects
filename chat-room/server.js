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
     ADD_ROOM_TO_LIST} = require('./serverConsts.js');
const EXPRESS = require('express');
const APP = EXPRESS();

const SERVER = APP.listen(PORT, () => console.log(`Chat is LIVE at ${SERVER_IP}`));

const IO = require('socket.io')(SERVER);

const NAMES = [
];

const ROOMS = {
    'Default room': []
};

IO.on("connection", socket => {
    let currRoom;
    let currUsername;
    socket.on(USER_CONNECTED_EVENT, (username, room) => {
        console.log(`${reverseIfHebrew(username)} connected`);
        currUsername = username;
        currRoom = room;
        if(!ROOMS.hasOwnProperty(currRoom)) {
            ROOMS[currRoom] = [];
            const ROOM_NAMES = Object.keys(ROOMS);
            IO.emit(ADD_ROOM_TO_LIST, ROOM_NAMES[ROOM_NAMES.length - 1]);
        }
        
        socket.join(currRoom);
        socket.emit(GET_MESSAGES_EVENT, ROOMS[currRoom]);
    })

    socket.on(GET_LAST_MESSAGE_EVENT, () => {
        let currMsgs = ROOMS[currRoom];
        socket.emit(GET_LAST_MESSAGE_EVENT, currMsgs[currMsgs.length - 1]);
    })

    socket.on(ADD_MESSAGE_EVENT, message => {
        let currMsgs = ROOMS[currRoom];
        console.log(`Added ${reverseIfHebrew(message.name)}'s message: ${reverseIfHebrew(message.content)}`);
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