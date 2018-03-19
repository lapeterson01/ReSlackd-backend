const requireLogin = require('../middlewares/requireLogin');
const pool = require('../db/pool');

module.exports = app => {
  app.get('/api/channels', requireLogin, async (req, res) => {
    //provide list of channels
    //allow a search in querystring
    let uID = req.user.uID;

    pool.query('SELECT name FROM channels')
    console.log('channels response')
  });

  app.get('/api/channels/:channelId', requireLogin, async (req, res) => {
    console.log('show all messages in channel (can be channel or dm)')
    // show 20 by default. allow requests for previous pages

    const message = [{name, userId, text, timestamp, image}]
  });


  app.get('/api/users', requireLogin, async (req, res) => {
    if (!req.user) return res.status(401).end()

    console.log('Search for users');
    
  });
  
  app.get('/api/user/channels', requireLogin, async (req, res) => {
    
    console.log('Search for users');

  });

  app.get('/api/current_user', requireLogin, async (req, res) => {
    
    console.log('gives user details for logged in user');

  });


};
