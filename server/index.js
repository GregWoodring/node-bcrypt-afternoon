const express = require('express');
const session = require('express-session');
const massive = require('massive');
require('dotenv').config();


const authController = require('./controllers/authController');
const treasureController = require('./controllers/treasureController');

const authMiddleware = require('./middleware/authMiddleware');

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

let app = express();
app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
//app.use(authMiddlware.usersOnly);


massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
}).catch(err => {
    console.log(`Error connecting to database ${err}`);
});

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/logout', authController.logout);

app.get('/api/treasure/dragon', treasureController.dragonTreasure);
app.get('/api/treasure/user', authMiddleware.usersOnly, treasureController.getUserTreasure);
app.post('/api/treasure/user', authMiddleware.usersOnly, treasureController.addMyTreasure);
app.get('/api/treasure/all', authMiddleware.usersOnly, authMiddleware.adminOnly, treasureController.getAllTreasure);

app.listen(SERVER_PORT, () => {
    console.log(`listening on port ${SERVER_PORT}`);
})