const express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const credentials = require('./sql/sql-credentials');
const keys = require('./config/dev');
// require('./models/User')
require('./services/passport');

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : credentials.username,
    password        : credentials.password,
    database        : 'reslackd'
})

const app = express();

// const sql = mysql.createConnection({
//     host: "localhost",
//     user: credentials.username,
//     password: credentials.password
// });

// const time = new Date();

// pool.query(`INSERT INTO users (name, imageURL, googleID, createdAt, lastActiveAt, lastLoginAt) VALUES ('Logan', 'example.jpg', '123456', ${time.getTime()}, ${time.getTime()}, ${time.getTime()})`, (err) => {
//     if (err) throw err;
//     console.log("values added");
// })

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('server is running on port 8080')
});