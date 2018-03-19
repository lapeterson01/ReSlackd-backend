//also includes our one PUT route!

const requireLogin = require('../middlewares/requireLogin');
const pool = require('../db/pool');

module.exports = app => {

  app.post('/api/channels/:channelId', requireLogin, async (req, res) => {
    console.log(req);
    const cID = req.params.channelId;
    const uID = req.user.uId;
    const text = req.body.text;
    let createdAt = req.user.createdAt + 9000;
    //make all enabled values true for now, since we don't yet know if we'd ever disable a message.
    let enabled = true;
    let messageValues = [text, createdAt, uID, cID, enabled];
    pool.query('INSERT INTO messages (text, createdAt, uID, cID, enabled) VALUES (?, ?, ?, ?, ?)', messageValues, (err, results, fields) => {
      if (err) throw err;

      res.send(`Successful post message ${text} into channel ${cID}`);

    });
  });

  app.put('/api/user/channels', requireLogin, async (req, res) => {
    console.log('allow the logged in user to leave a channel');

  });

  app.post('/api/user/channels/add', requireLogin, async (req, res) => {
    console.log('add user to channel');

  });

  app.post('/api/channels/add', requireLogin, async (req, res) => {
    console.log('Add a new channel');

  });


};
