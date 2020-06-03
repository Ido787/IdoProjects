const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/msgs', (req, res) => res.send(MSGS));

app.post('/send', (req, res) => console.log(res.body));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const MSGS = [
    {name: 'עידו', content: 'מה קורה'},
    {name: 'שקד', content: 'היי בובה בובה בואי נרקוד קצת סמבה'},
    {name: 'גוני', content:'גזר! גזר! גזר'}
];