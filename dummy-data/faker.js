const express = require('express');
const router = require('express').Router();
const faker = require('faker');
const bodyParser = require('body-parser');
const app = express();
const sql = require('../db/pool');
const fs = require('fs')
const moment = require('moment');

// generate fake data route - comment out so data is only generated once.

// connection.query('SELECT * FROM `Movie` WHERE `year` < ? AND `title` = ?', [2000,'Star Wars'], function (error, results, fields){});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });


// message = [{username, userId, text, timestamp, image}]. show 20 by default.
const createMessageData = () => {
  const makeMessage = (username, userId, text, timestamp, imageURL) => {
    return {username, userId, text, timestamp, imageURL}
  }

  let messages = [];

  for (let i = 0; i < 60; i++){
    let username = faker.internet.userName();
    let userId = faker.random.uuid();
    let text = faker.lorem.sentence();
    let timestamp = moment(faker.date.recent()).valueOf();
    let imageURL = faker.image.imageUrl();
    messages.push(makeMessage(username, userId, text, timestamp, imageURL));
  }

  return messages;
};

const messageData = createMessageData();

//comment this out once it's been created!

fs.writeFile('messageData.json', JSON.stringify(messageData), (err) => {
  if (err) throw err;
});

