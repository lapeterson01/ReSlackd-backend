//also includes our one PUT route!

const requireLogin = require('../middlewares/requireLogin');
const pool = require('../db/pool');

module.exports = app => {

  app.post('/api/channels/:channelId', requireLogin, async (req, res) => {
    const post = {
      cID: req.params.channelId,
      uID: req.user.uID,
      text: req.body.text,
      createdAt: req.user.createdAt,
      enabled: true
    }
    let messageValues = [post.text, post.createdAt, post.uID, post.cID, post.enabled];
    pool.query('INSERT INTO messages (text, createdAt, uID, cID, enabled) VALUES (?, ?, ?, ?, ?)', messageValues, (err, results, fields) => {
      if (err) throw err;
      res.send(post);
    });
  });

  app.put('/api/user/channels', requireLogin, async (req, res) => {
    console.log('allow the logged in user to leave a channel');
    console.log(req);
    console.log(res);
  });

  app.post('/api/user/channels/add', requireLogin, async (req, res) => {
    console.log('add user to channel');

  });

  app.post('/api/channels/add', requireLogin, async (req, res) => {
    console.log('Add a new channel');

  });


};
