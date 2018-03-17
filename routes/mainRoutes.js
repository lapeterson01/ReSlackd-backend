const requireLogin = require('../middlewares/requireLogin');
const mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'username',
  password        : 'password',
  database        : 'reslackd'
});

module.exports = app => {
  app.get('/api/channels', requireLogin, async (req, res) => {
    if (!req.user) return res.status(401).end()
    console.log('channels response')
  });

  app.get('/api/channels/:channelId', requireLogin, async (req, res) => {
    console.log('show all messages in channel (can be channel or dm)')
    // show 20 by default.
    const message = [{username, userId, text, timestamp, image}]
  });

  app.post('/api/channels', requireLogin, async (req, res) => {
    console.log('post message in channel');
  });

  app.get('/api/users', requireLogin, async (req, res) => {
    if (!req.user) return res.status(401).end()

    console.log('Search for users');
    
  });
  
  app.get('/api/user/channels', requireLogin, async (req, res) => {
    if (!req.user) return res.status(401).end()
    console.log('Search for users');

  });

  app.put('/api/user/channels', requireLogin, async (req, res) => {
    console.log('allow the logged in user to leave a channel');

  });

  app.post('/api/user/channels/add', requireLogin, async (req, res) => {
    console.log('add user to channel');

  });

  app.get('/api/current_user', requireLogin, async (req, res) => {
    if (!req.user) return res.status(401).end()
    console.log('gives user details for logged in user');

  });

  app.post('/api/channels/add', requireLogin, async (req, res) => {
    console.log('Add a new channel');

  });


};
