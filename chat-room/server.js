const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');
const CORS = require('cors');
const PORT = 3000;
const APP = EXPRESS();

APP.use(CORS());
APP.use(BODY_PARSER.json());

const SERVER = APP.listen(PORT, () => console.log(`Chat is LIVE at http://localhost:${PORT}`));

const IO = require('socket.io')(SERVER);

let usersOnline = 0;

IO.on("connection", socket => {
    socket.on("userConnected", username => {
        usersOnline++;
        console.log(`${reverseIfHebrew(username)} connected, ${usersOnline} users online`);
    })
    
    socket.emit("getMsgs", MSGS);

    socket.on("addMsg", msg => {
        console.log(`Added ${reverseIfHebrew(msg.name)}'s message: ${reverseIfHebrew(msg.content)}`);
        MSGS.push(msg);
        IO.emit("getMsgs", MSGS);
    })

    socket.on("disconnect", socket => {
        usersOnline--;
        console.log(`Someone signed out, ${usersOnline} users online`);
    })
})


const MSGS = [
];

function reverseIfHebrew(st) {
    return /[\u0590-\u05fe]/.test(st) ? st.split("").reverse().join("") : st;
}