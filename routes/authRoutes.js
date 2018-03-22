const passport = require('passport');
const pool = require('../db/pool');
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/');
        }
    );

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.get('/api/logout', requireLogin, (req, res) => {
        const currentTime = new Date();
        pool.query('UPDATE users SET lastActiveAt = ? WHERE uID = ?', [currentTime.getTime(), req.user.uID], (err, results, fields) => {
            if (err) throw err;
            req.logout();
            res.redirect('/');
        })
    })
};