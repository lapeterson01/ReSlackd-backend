const mysql = require('mysql');
const credentials = require('../sql/sql-credentials');

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : credentials.username,
    password        : credentials.password,
    database        : 'reslackd'
})

module.exports = pool;