const mysql = require('mysql');
const credentials = require('../sql/sql-credentials');

const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL)

module.exports = pool;