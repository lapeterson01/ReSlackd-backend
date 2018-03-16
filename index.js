const express = require('express');
const passport = require('passport');
const socket = require('socket.io');
const mysql = require('mysql');
const credentials = require('./sql/sql-credentials');
// require('./models/User')
require('./services/passport');

const app = express();

require('./routes/authRoutes')(app);

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : credentials.username,
    password        : credentials.password,
    database        : 'reslackd'
})

const sql = mysql.createConnection({
    host: "localhost",
    user: credentials.username,
    password: credentials.password
});

pool.query(`INSERT INTO users (name, googleID, createdAt, lastActiveAt, lastLoginAt) VALUES (Logan, 123456, 2011-01-22, 2011-01-22, 2011-01-22)`, (err) => {
    if (err) throw err;
    console.log("values added");
})

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('server is running on port 8080')
});