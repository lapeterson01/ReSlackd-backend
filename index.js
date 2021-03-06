const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const keys = require('./config/keys');
const cors = require('cors');
require('./services/passport');
const pool = require('./db/pool');

const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors());

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

//code that should redirect requests to client in production
if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('client/build'));
  
    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

io.on('connection', (socket) => {

  //Listens for a new chat message
  socket.on('chat message', (message) => {

    //Send message to those connected in the room
    io.sockets.in(message.cID).emit('receive message', message);

    message.uID = Number(message.uID);
    let messageValues = [message.text, message.timestamp, message.uID, message.cID, message.enabled];
    pool.query('INSERT INTO messages (text, createdAt, uID, cID, enabled) VALUES (?, ?, ?, ?, ?)', messageValues, (err, result) => {
      if (!err) {
        console.log(result);
      } else
        console.log('Error while performing Query.', err);
    });
  });

  
  socket.on('room', (room) => {
    socket.join(room.room);
  });

  socket.on('leave room', (room) => {
    socket.leave(room.room);
  });


  socket.on('disconnect', () => {
  });

});

