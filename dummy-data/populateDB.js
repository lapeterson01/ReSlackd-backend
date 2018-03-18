const fs = require('fs');
const pool = require('../db/pool');
const faker = require('faker');
const moment = require('moment');

const populateUsersDB = () => {
  fs.readFile('./dummy-data/usersData.json', 'utf8', (err, usersData) => {
    if (err) throw err;
    let users = JSON.parse(usersData);
    users.forEach((currentUser) => {
      let userValues = [currentUser.name, currentUser.imageURL, currentUser.googleID, currentUser.createdAt, currentUser.lastActiveAt, currentUser.lastLoginAt];

      pool.query('INSERT INTO users (name, imageURL, googleID, createdAt, lastActiveAt, lastLoginAt) VALUES (?, ?, ?, ?, ?, ?)', userValues, (err, res) => {
        if (err) throw err;
        console.log(res);
      })
    })
  })
};

//comment out function invocations so we don't re-run this and repopulate the DB!

// populateUsersDB();

//create non-DM channels - can have any names and users, always have type "channel"
const populateChannelsDB = () => {

  for (let i = 0; i < 30; i++){
    let name = faker.company.bsNoun();
    let createdAt = moment(faker.date.past()).valueOf();
    let type = 'channel';
    let channelValues = [name, createdAt, type];
    pool.query('INSERT INTO channels (name, createdAt, type) VALUES (?, ?, ?)', channelValues, (err, results) => { 
      if (err) throw err;
    });
  }
}

// populateChannelsDB();

//create DM channels - no name attribute, type = dm
const addDMChannels = () => {
  for (let i = 0; i < 12; i++){
    let createdAt = moment(faker.date.past()).valueOf();
    let type = 'dm';
    let dmValues = [null, createdAt, type]
    pool.query('INSERT INTO channels (name, createdAt, type) VALUES (?, ?, ?)', dmValues, (err, results) => { 
      if (err) throw err;
    });
  }
}

// addDMChannels();

//Populating the users2channels join table is trickier. We need to take existing uIDs and cIDs, and also treat channels and DMs slightly differently. 

//Here's the function we'll use to populate the table. But first, we need to query the database for users, channels, and dms.

const populateUsers2ChannelsDB = (uIDs, cIDs, dmIDs) => {

  //helper function to grab pseudorandom elements from users and channels
  const getRandomArrayIndex = (array) => (Math.floor(Math.random() * 1000)) % array.length;
  
  //function to populate channels with users. In the real world, all dms would have exactly 2 users, and all channels would have a number of users between 0 and the total number of users.
  const populateChannel = (channelId, numberOfUsers) => {
    
    //make copy array so we can remove users once they are assigned to the channel. this avoids assigning one user multiple times to the same channel.
    let unassignedUsersIds = uIDs.slice();

    //add users to channel until we reach the number we passed as an argument
    for (let i = 0; i < numberOfUsers; i++) {
    
    //grab a user at random. remove them from unassigned users array. 
      let randomUserIndex = getRandomArrayIndex(unassignedUsersIds);
      let randomUserId = unassignedUsersIds.splice(randomUserIndex, 1)[0];
      let joinedAt = moment(faker.date.past()).valueOf();
      
      //active is usually true. give it a pseudorandom value that usually returns true.
      let active = Math.floor(Math.random() * 10) < 9;    
    
    // use the channelId we passed as an argument and the user, joinedAt, and active values we generated to create a record in the users2channels table
      let users2channelsValues = [randomUserId, channelId, joinedAt, active];
      pool.query('INSERT INTO users2channels (uID, cID, joinedAt, active) VALUES (?, ?, ?, ?)', users2channelsValues, (err, results) => {
        if (err) throw err;
      });
    }
  }

  //loop through our dms and assign 2 users to each dm
  dmIDs.forEach( (dmID) => {
    populateChannel(dmID, 2);
  }); 

  //loop through our channels and assign users to those channels. number of users will be a random value between 0 and the total number of users.
  cIDs.forEach( (cID) => {
    //use our array index generator to get a number between 0 and the total number of users.
    let numberOfUsers = getRandomArrayIndex(uIDs);
    populateChannel(cID, numberOfUsers);
  })
}

//Get uIDs for all users and cIDs for channels and dms.
const getDataThenPopulateUsers2ChannelsDB = () => {
 
  let uIDs = null;
  let cIDs = null;
  let dmIDs = null;
  
  pool.query('SELECT uID FROM users', (err, results, fields) => {
    if (err) throw err;
    // use map function to remove node-mysql wrapper object
    uIDs = results.map(result => result.uID);
    if (uIDs && cIDs && dmIDs) populateUsers2ChannelsDB(uIDs, cIDs, dmIDs);
  })

  pool.query('SELECT cID FROM channels WHERE `type` = "channel"', (err, results, fields) => {
    if (err) throw err;
    // use map function to remove node-mysql wrapper object
    cIDs = results.map(result => result.cID);
    if (uIDs && cIDs && dmIDs) populateUsers2ChannelsDB(uIDs, cIDs, dmIDs);
  })

  pool.query('SELECT cID FROM channels WHERE `type` = "dm"', (err, results, fields) => {
    if (err) throw err;
    // use map function to remove node-mysql wrapper object
    dmIDs = results.map(result => result.cID);
    if (uIDs && cIDs && dmIDs) populateUsers2ChannelsDB(uIDs, cIDs, dmIDs);
  })
}

// getDataThenPopulateUsers2ChannelsDB();

const populateMessagesDB = () => {
  pool.query('INSERT INTO messages (text, createdAt, uID, cID, enabled) VALUES (?, ?, ?, ?, ?)')
}

