const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const keys = require('./config/keys');
require('./services/passport');
// const pool = require('../db/pool');

const PORT = process.env.PORT || 8080;
const app = express();

const server = app.listen(PORT, () => {
  console.log('server is running on port 8080')
});
const io = require('socket.io')(server);

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
require('./routes/getRoutes')(app);
require('./routes/postRoutes')(app);


io.on('connection', (socket) => {
  console.log("client connected with id " + socket.id)


  //Listens for a new chat message
  socket.on('chat message', (message) => {

    //Send message to those connected in the room
    io.sockets.in(message.cID).emit('receive message', message);

    console.log('new message: ', message)
    // message.enabled = true;
    // let messageValues = [message.text, message.timestamp, message.uID, message.cID, message.enabled];
    // pool.query('INSERT INTO messages (text, createdAt, uID, cID, enabled) VALUES (?, ?, ?, ?, ?)', messageValues, (err, result) => {
    //   if (!err) {
    //     console.log(result);
    //   } else
    //     console.log('Error while performing Query.', err);
    // });
  });

  
  socket.on('room', (room) => {
    console.log('Enter room:', room)
    socket.join(room.room);
  });

  socket.on('leave room', (room) => {
    console.log('Leaving room... :(', room)
    socket.leave(room.room);
  });


  socket.on('disconnect', () => {
    console.log("deleted socket:" + socket.id);
  });

});

