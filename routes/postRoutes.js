//also includes our one PUT route!

const requireLogin = require('../middlewares/requireLogin');
const pool = require('../db/pool');

module.exports = app => {

  app.post('/api/channels', requireLogin, async (req, res) => {
    console.log('post message in channel');
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
