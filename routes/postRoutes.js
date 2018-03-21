//also includes our one PUT route!

const requireLogin = require('../middlewares/requireLogin');
const pool = require('../db/pool');

module.exports = app => {

// Add a message to a channel
  app.post('/api/channels/:channelId', requireLogin, async (req, res) => {
    if (req.body.text == '' || !req.body.text) {
      res.status(400).send('You must fill out message field');
      return;
    }
    // const currentTime = new Date();
    // const post = {
    //   cID: req.params.channelId,
    //   uID: req.user.uID,
    //   text: req.body.text,
    //   createdAt: currentTime.getTime(),
    //   enabled: true
    // }
    // let messageValues = [post.text, post.createdAt, post.uID, post.cID, post.enabled];
    // pool.query('INSERT INTO messages (text, createdAt, uID, cID, enabled) VALUES (?, ?, ?, ?, ?)', messageValues, (err, results, fields) => {
    //   if (err) throw err;
    //   res.send(post);
    // });
  });

// Remove currently logged in user from a channel
  app.put('/api/user/channels', requireLogin, async (req, res) => {
    if (req.body.channel == "" || !req.body.channel) {
      res.status(400).send('You must select a channel.');
      return;
    }
    const currentTime = new Date();
    const user = {
      uID: req.user.uID,
      cID: req.body.channel,
      joinedAt: currentTime.getTime(),
      active: true
    }
    const messageValues = [user.uID, user.cID];
    pool.query('SELECT * FROM users2channels WHERE uID = ? AND cID = ?', messageValues, (err, existingUser, fields) => {
      if (err) throw err;
      if (existingUser.length == 0) {
        res.status(404).send('You are not currently a member of selected channel.');
        return;
      } else {
        pool.query('DELETE FROM users2channels WHERE uID = ? AND cID = ?', messageValues, (err, results, fields) => {
          if (err) throw err;
          res.send(user);
        })
      }
    })
  });

// Add user(s) to a channel
  app.post('/api/user/channels/add', requireLogin, async (req, res) => {
    if (req.body.users == "" || !req.body.users || req.body.users.length == 0) {
      res.status(400).send('You must select users to add to channel.')
      return;
    }
    if (req.body.channel == "" || !req.body.channel) {
      res.status(400).send('You must select a channel.')
      return;
    }
    const currentTime = new Date();
    const user = {
      uID: req.body.users,
      cID: req.body.channel,
      joinedAt: currentTime.getTime(),
      active: true
    }
    let userIDs = 'uID = ?';
    let messageValues = [user.cID, user.uID[0]]
    for (let i = 1; i < user.uID.length; i++) {
      userIDs = userIDs.concat(' OR uID = ?')
      messageValues.push(user.uID[i]);
    }
    let selectQuery = `SELECT * FROM users2channels WHERE (cID = ?) AND (${userIDs})`;
    pool.query(selectQuery, messageValues, (err, existingUser, fields) => {
      if (err) throw err;
      if (existingUser.length > 0) {
        res.status(400).send('Cannot add users to channel they are already in.');
        return;
      } else {
        let insertQuery = 'INSERT INTO users2channels (uID, cID, joinedAt, active) VALUES (?, ?, ?, ?)';
        let insertMessageValues = [user.uID[0], user.cID, user.joinedAt, user.active]
        for (let i = 1; i < user.uID.length; i++) {
          insertQuery = insertQuery.concat(', (?, ?, ?, ?)');
          insertMessageValues.push(user.uID[i], user.cID, user.joinedAt, user.active);
        }
        pool.query(insertQuery, insertMessageValues, (err, results, fields) => {
          if (err) throw err;
          res.send(user);
        })
      }
    })
  });

// Create channel or DM
  app.post('/api/channels', requireLogin, async (req, res) => {
    if (req.body.name.length > 45) {
      res.status(400).send('Channel name cannot exceed 45 characters.');
      return;
    }
    if (req.body.purpose.length > 255) {
      res.status(400).send('Channel purpose cannot exceed 255 characters.');
      return;
    }

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
    if (channel.type.toUpperCase() == 'DM') {
      if (channel.uID.length != 2) {
        res.status(400).send('You can only select 1 user for DMs.')
        return;
      }
      channel.purpose = null;
    } else if (channel.type.toUpperCase() == 'CHANNEL') {
      if (channel.name == null) {
        res.status(400).send('Channel name required')
        return;
      }
    } else {
      res.status(400).send('Type must be either DM or channel');
      return;
    }
    pool.query('SELECT * FROM channels WHERE name = ?', [channel.name], (err, existingChannel, fields) => {
      if (err) throw err;
      if (channel.type == 'channel') {
        if (existingChannel.length > 0) {
          res.status(400).send(`Duplicate ${channel.type}`);
          return;
        }
      } else {
        if (existingChannel.length > 0) {
          res.send(channel)
          return;
        }
      }
      let messageValues = [channel.name, channel.purpose, channel.createdAt, channel.type];
      pool.query('INSERT INTO channels (name, purpose, createdAt, type) VALUES (?, ?, ?, ?)', messageValues, (err, results, fields) => {
        if (err) throw err;
        channel.cID = results.insertId.toString();
        channel.uID.forEach((user) => {
          let u2cMessageValues = [user, channel.cID, channel.joinedAt, channel.active];
          pool.query('INSERT INTO users2channels (uID, cID, joinedAt, active) VALUES (?, ?, ?, ?)', u2cMessageValues, (err, results, fields) => {
            if (err) throw err;
          })
        })
        res.send(channel);
      })  
    })
  });
};
