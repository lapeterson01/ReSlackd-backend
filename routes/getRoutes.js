const requireLogin = require('../middlewares/requireLogin');
const pool = require('../db/pool');

module.exports = app => {
  app.get('/api/user/channels', requireLogin, (req, res) => {
    //provide list of channels for logged in user
    let uID = pool.escape(req.user.uID);
    //parse query string for search params. convert both search and name-to-be-searched to lowercase.
    let search = '';
    let type = '';
    if (req.query.type) type = req.query.type.toLowerCase();
    if (req.query.search) search = pool.escape(`%${req.query.search}%`).toLowerCase();
  
    //perform different queries for channels and dms. channels query returns channel name. 
  
    let channelsQuery = `SELECT channels.cID, channels.name, channels.type FROM channels JOIN users2channels ON users2channels.cID = channels.cID JOIN users ON users2channels.uID = users.uID WHERE users.uID = ${uID} AND channels.type = 'channel'`;

    if (search) channelsQuery += ` AND LOWER(channels.name) LIKE ${search}`

    let dmsQuery =`SELECT channels.cID, users.name, channels.type FROM channels JOIN users2channels ON users2channels.cID = channels.cID JOIN users ON users2channels.uID = users.uID 
    WHERE channels.cID IN (SELECT channels.cID FROM channels JOIN users2channels ON users2channels.cID = channels.cID JOIN users ON users2channels.uID = users.uID WHERE users.uID = ${uID} AND channels.type = 'dm') AND users.uID <> ${uID}`;

    if (search) dmsQuery += ` AND LOWER(users.name) LIKE ${search}`

    let bothQuery = `${channelsQuery} UNION ${dmsQuery}`;

    let finalQuery = '';

    
    switch (type) {
      case '': {
        finalQuery = bothQuery;
        break;
      }
      case 'channel': {
        finalQuery = channelsQuery;
        break;
      }
      case 'dm': {
        finalQuery = dmsQuery;
        break;
      }
      default: {
        return res.send(400, "If a type parameter is provided, its value must be 'channel' or 'dm'.");
      }
    };

    pool.query(finalQuery, (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    })
  });

  app.get('/api/channels/:channelId', requireLogin, async (req, res) => {

    // show 20 by default. allow requests for previous pages
    let channelId = req.params.channelId;

    //If there is a page in the request, subtract 1 (page 1 is offset by 0 pages, and so on).
    //Multiply page offset by 20 because 20 results per page.
    let offset = req.query.page ? (parseInt(req.query.page) - 1) * 20 : 0;

    let messagesQuery = 'SELECT users.name, users.uID, messages.text, messages.createdAt as timestamp, users.imageURL FROM messages join users on messages.uID = users.uID join channels on channels.cID = messages.cID WHERE channels.cID = ? ORDER BY messages.createdAt DESC  LIMIT 20 OFFSET ?';

    pool.query(messagesQuery, [channelId, offset], (err, results, fields) => {
      if (err) throw err;
      res.send(results); 
    })

    
  });


  app.get('/api/users', requireLogin, (req, res) => {
    let userQuery = 'SELECT * from users';
    let search = '';
    if (req.query.search) search = req.query.search.toLowerCase();
    if (search) userQuery += ` WHERE LOWER(name) LIKE '%${search}%'`;
    pool.query(userQuery, (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    })
    
  });
  
  app.get('/api/channels', requireLogin, (req, res) => {
    let channelsQuery = 
      `SELECT *
      FROM users as u
      INNER JOIN users2channels as uc
        ON u.uID = uc.uID
      INNER JOIN channels as c
        ON uc.cID = c.cID
      WHERE c.type = 'channel'`;
    
    pool.query(channelsQuery, (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    })

  })


  app.get('/api/current-user', requireLogin, (req, res) => {
    let uID = req.user.uID;
    let currentUserQuery = `SELECT * FROM users WHERE uID = ${uID}`;
    pool.query(currentUserQuery, (err, results, fields) => {
      if (err) throw err;
      res.json(results);
    })
  });


};
