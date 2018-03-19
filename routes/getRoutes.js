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

    // show 20 by default. allow requests for previous pages
    let channelId = req.params.channelId;

    //If there is a page in the request, subtract 1 (page 1 is offset by 0 pages, and so on).
    //Multiply page offset by 20 because 20 results per page.
    let offset = req.query.page ? (parseInt(req.query.page) - 1) * 20 : 0;

    let sqlQuery = 'SELECT users.name, users.uID, messages.text, messages.createdAt as timestamp, users.imageURL FROM messages join users on messages.uID = users.uID join channels on channels.cID = messages.cID WHERE channels.cID = ? ORDER BY messages.createdAt DESC  LIMIT 20 OFFSET ?';

    pool.query(sqlQuery, [channelId, offset], (err, results, fields) => {
      if (err) throw err;
      res.send(results); 
    })

    
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
