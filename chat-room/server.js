const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');
const CORS = require('cors');
const PORT = 3000;
const APP = EXPRESS();

APP.use(CORS());
APP.use(BODY_PARSER.json());

// Express server
const server = APP.listen(PORT, () => console.log(`Chat is LIVE at http://localhost:${PORT}`));

// Socket
let io = require('socket.io')(server);

io.on("connection", socket => {
    socket.on("userConnected", username => {
        console.log(`${username} connected`);
    })
    
    socket.emit("getMsgs", MSGS);

    socket.on("addMsg", msg => {
        console.log(`Added ${msg.name}'s message: ${msg.content}`);
        MSGS.push(msg);
        io.emit("getMsgs", MSGS);
    })
})

const MSGS = [
]; 