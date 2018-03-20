const pool = require('../db/pool');
const mysql = require('mysql');



  pool.query('SELECT * FROM `users`', (error, results, fields) => {
    if (error) throw error;
    console.log(results)
  });