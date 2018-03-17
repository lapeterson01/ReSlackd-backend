const faker = require('faker');
const fs = require('fs')
const moment = require('moment');


//create dummy data for the following routes:

// GET	/api/channel/:channelId	show all messages in channel (can be channel or dm)
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

//comment out all fs.writeFile commands after running so files aren't rewritten

// fs.writeFile('messageData.json', JSON.stringify(messageData), (err) => {
//   if (err) throw err;
// });


// GET	/api/channels	gets list of channels	includes optional search parameters	search - in query 

const createChannelData =  () => {
  const makeChannel = (channelId, name, type, createdAt) => {
    return {channelId, name, type, createdAt};
  }
  //channel can be one of two types
  let channels = [];
  for (let i = 0; i < 20; i++){
    let type = Math.floor(Math.random() * 10) % 2 ? 'channel' : 'dm' 
    let channelId = faker.random.uuid();
    let name = type === 'channel' 
      ? faker.company.catchPhraseNoun()
      : faker.name.firstName();
    let createdAt = moment(faker.date.past()).valueOf();
    channels.push(makeChannel(channelId, name, type, createdAt))
  }
  return channels;
}

const channelData = createChannelData();

// fs.writeFile('channelData.json', JSON.stringify(channelData), (err) => {
//   if (err) throw err;
// })


// GET	/api/users	Search for users
//pull current user out of full users list
const createUsersData = () => {
  const makeUser = (uID, name, imageURL, googleID, createdAt, lastActiveAt, lastLoginAt) => {
    return {uID, name, imageURL, googleID, createdAt, lastActiveAt, lastLoginAt}
  }
  let users = [];
  for (let i = 0; i < 21; i++) {
    let uID = faker.random.uuid();
    let name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    let imageURL = faker.image.people();
    let googleID = faker.random.uuid();
    let createdAt = moment(faker.date.past()).valueOf();
    let lastActiveAt = moment(faker.date.recent()).valueOf();
    let lastLoginAt = moment(faker.date.past()).valueOf();
    users.push(makeUser(uID, name, imageURL, googleID, createdAt, lastActiveAt, lastLoginAt))
  }
  return users;
}

const usersData = createUsersData();

// GET	/api/current_user	gives user details for logged in user
const currentUserData = usersData[0];

// fs.writeFile('usersData.json', JSON.stringify(usersData), (err) => {
//   if (err) throw err;
// });

// fs.writeFile('currentUserData.json', JSON.stringify(currentUserData), (err) => {
//   if (err) throw err;
// });

