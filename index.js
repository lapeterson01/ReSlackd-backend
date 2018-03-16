const express = require('express');
const passport = require('passport');
const socket = require('socket.io');
const mysql = require('mysql');
const credentials = require('./sql/sql-credentials');
require('./services/passport');

const app = express();

require('./routes/authRoutes')(app);

const sql = mysql.createConnection({
    host: "localhost",
    user: credentials.username,
    password: credentials.password
});

sql.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('server is running on port 8080')
});