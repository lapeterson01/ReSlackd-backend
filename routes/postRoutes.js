//also includes our one PUT route!

const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');
const pool = keys.pool;

module.exports = app => {

// Add a message to a channel
  app.post('/api/channels/:channelId', requireLogin, async (req, res) => {
    const currentTime = new Date();
    const post = {
      cID: req.params.channelId,
      uID: req.user.uID,
      text: req.body.text,
      createdAt: currentTime.getTime(),
      enabled: true
    }
    let messageValues = [post.text, post.createdAt, post.uID, post.cID, post.enabled];
    pool.query('INSERT INTO messages (text, createdAt, uID, cID, enabled) VALUES (?, ?, ?, ?, ?)', messageValues, (err, results, fields) => {
      if (err) throw err;
      res.send(post);
    });
  });

// Remove currently logged in user(s) from a channel
  app.put('/api/user/channels', requireLogin, async (req, res) => {
    const currentTime = new Date();
    const user = {
      uID: req.user.uID,
      cID: req.body.channel,
      joinedAt: currentTime.getTime(),
      active: true
    }
    const messageValues = [user.uID, user.cID];
    pool.query('DELETE FROM users2channels WHERE uID = ? AND cID = ?', messageValues, (err, results, fields) => {
      if (err) throw err;
      res.send(user);
    })
  });

// Add user(s) to a channel
  app.post('/api/user/channels/add', requireLogin, async (req, res) => {
    const currentTime = new Date();
    const user = {
      uID: req.body.users,
      cID: req.body.channel,
      joinedAt: currentTime.getTime(),
      active: true
    }
    for (let i = 0; i < user.uID.length; i++) {
      const messageValues = [user.uID[i], user.cID, user.joinedAt, user.active];
      pool.query('INSERT INTO users2channels (uID, cID, joinedAt, active) VALUES (?, ?, ?, ?)', messageValues, (err, results, fields) => {
        if (err) throw err;
      })
    }
    res.send(user);
  });

// Create channel or DM
  app.post('/api/channels', requireLogin, async (req, res) => {
    const currentTime = new Date();
    const channel = {
      name: req.body.name,
      purpose: req.body.purpose,
      createdAt: currentTime.getTime(),
      type: req.body.type,
      cID: "",
      uID: req.body.users,
      joinedAt: currentTime.getTime(),
      active: true
    }
    if (!Array.isArray(channel.uID) || channel.uID.length == 0) {
      res.status(400).send('You must select a user.');
      return;
    }
    channel.uID.push(req.user.uID);
    if (channel.type == 'DM') {
      if (channel.uID.length != 2) {
        res.status(400).send('You can only select 1 user for DMs.')
        return;
      }
      channel.name = null;
      channel.purpose = null;
    } else if (channel.type == 'channel') {
      if (channel.name == null) {
        res.status(400).send('Channel name required')
        return;
      }
    } else {
      res.status(400).send('Type must be either DM or channel');
      return;
    }
    let messageValues = [channel.name, channel.purpose, channel.createdAt, channel.type];
    pool.query('INSERT INTO channels (name, purpose, createdAt, type) VALUES (?, ?, ?, ?)', messageValues, (err, results, fields) => {
      if (err) throw err;
      channel.cID = results.insertId.toString();
      for (let i = 0; i < channel.uID.length; i++) {
        let u2cMessageValues = [channel.uID[i], channel.cID, channel.joinedAt, channel.active];
        pool.query('INSERT INTO users2channels (uID, cID, joinedAt, active) VALUES (?, ?, ?, ?)', u2cMessageValues, (err, results, fields) => {
          if (err) throw err;
        })
      }
      res.send(channel);
    })
  });
};
