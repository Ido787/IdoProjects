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
let express = require('express');
let app = express();

let server = app.listen(PORT, () => console.log(`Chat is LIVE at ${SERVER_IP}`));

let io = require('socket.io')(server, {pingTimeout: 2000});

let names = [
];

let rooms = {
    'Default room': []
};

let isDefaultNameReset = false;

io.on("connection", socket => {
    let currRoom;
    let currUsername;

    if(!isDefaultNameReset) {
        socket.emit(RESET_DEFAULT_NAME_EVENT);
        isDefaultNameReset = true;
    }

    socket.on(USER_CONNECTED_EVENT, (username, room) => {
        console.log(`${reverseIfHebrew(username)} connected to ${room}`);
        if(!rooms.hasOwnProperty(room)) {
            rooms[room] = [];
            const ROOM_NAMES = Object.keys(rooms);
            io.emit(ADD_ROOM_TO_LIST, ROOM_NAMES[ROOM_NAMES.length - 1]);
        }
        socket.join(room);
        socket.emit(GET_MESSAGES_EVENT, rooms[room]);
        currUsername = username;
        currRoom = room;
    })

    socket.on(GET_LAST_MESSAGE_EVENT, () => {
        let currMsgs = rooms[currRoom];
        socket.emit(GET_LAST_MESSAGE_EVENT, currMsgs[currMsgs.length - 1]);
    })

    socket.on(ADD_MESSAGE_EVENT, message => {
        console.log(`Added ${reverseIfHebrew(message.name)}'s message: ${reverseIfHebrew(message.content)}`);
        let currMsgs = rooms[currRoom];
        currMsgs.push(message);
        io.to(currRoom).emit(GET_LAST_MESSAGE_EVENT, currMsgs[currMsgs.length - 1]);
    })
    
    socket.on(IS_NAME_EXISTS_EVENT, name => {
        socket.emit(IS_NAME_EXISTS_EVENT, names.includes(name));
    })

    socket.on(ADD_NAME_EVENT, name => {
        names.push(name);
    })

    socket.emit(GET_ROOM_NAMES, Object.keys(rooms));

    socket.on("disconnect", () => {
        if(currUsername) {
            const INDEX = names.indexOf(currUsername);
            if(INDEX > - 1) {
                names.splice(INDEX, 1);
            }
            console.log(`${reverseIfHebrew(currUsername)} disconnected from ${currRoom}`);
            socket.leave(currRoom);
        }
    })
})

function reverseIfHebrew(st) {
    return /[\u0590-\u05fe]/.test(st) ? st.split("").reverse().join("") : st;
}