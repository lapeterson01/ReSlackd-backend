//also includes our one PUT route!

const requireLogin = require('../middlewares/requireLogin');
const pool = require('../db/pool');

module.exports = app => {

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

  app.put('/api/user/channels', requireLogin, async (req, res) => {
    console.log('allow the logged in user to leave a channel');
    console.log(req);
    console.log(res);
  });

  app.post('/api/user/channels/add', requireLogin, async (req, res) => {
    // pool.query('INSERT INTO users2channels (uID, cID, joinedAt, active) VALUES (?, ?, ?, ?)')
    console.log('add user to channel');

  });

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
    channel.uID.push(req.user.uID);
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
