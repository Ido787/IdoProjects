const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');
const APP = EXPRESS();
const CORS = require('cors');
const PORT = 3000;

APP.use(CORS());
APP.use(BODY_PARSER.json());

APP.get('/msgs', (req, res) => res.send(MSGS));
APP.post('/send', (req, res) => {
    console.log(`Added ${req.body.name.split("").reverse().join("")}'s message`);
    MSGS.push(req.body);
});

APP.listen(PORT, () => console.log(`Chat is LIVE at http://localhost:${PORT}`))

const MSGS = [
];