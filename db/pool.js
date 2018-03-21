const mysql = require('mysql');
require('dotenv').config();
const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL)

module.exports = pool;