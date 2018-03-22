const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const sql = require('../db/pool');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    sql.query('SELECT * FROM users WHERE googleID = ?', [id], (err, user, fields) => {
        if (err) throw err;
        done(null, user[0])
    })
})

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            sql.query('SELECT * FROM users WHERE googleID = ?', [profile.id], (err, existingUser, fields) => {
                if (err) throw err;
                const time = new Date();
                if (existingUser.length > 0) {
                    sql.query('UPDATE users SET lastLoginAt = ?, lastActiveAt = ? WHERE uID = ?', [time.getTime(), time.getTime(), existingUser[0].uID], (err, results, fields) => {
                        if (err) throw err;
                        done(null, profile);
                    })
                } else {
                    sql.query('INSERT INTO users (name, imageURL, googleID, createdAt, lastActiveAt, lastLoginAt) VALUES (?, ?, ?, ?, ?, ?)', [profile.displayName, profile.photos[0].value, profile.id, time.getTime(), time.getTime(), time.getTime()], (err, result) => {
                        if (err) throw err;
                        done(null, profile)
                    });
                }
            })
        }
    )
);