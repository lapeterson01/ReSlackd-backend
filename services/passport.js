const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/dev');
const sql = require('../db/pool');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, id);
})

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            sql.query('SELECT * FROM users WHERE googleID = ?', [profile.id], (err, existingUser, fields) => {
                if (err) throw err;
                if (existingUser.length > 0) {
                    done(null, profile);
                } else {
                    let time = new Date();
                    sql.query('INSERT INTO users (name, imageURL, googleID, createdAt, lastActiveAt, lastLoginAt) VALUES (?, ?, ?, ?, ?, ?)', [profile.displayName, profile.photos[0].value, profile.id, time.getTime(), time.getTime(), time.getTime()], (err, result) => {
                        if (err) throw err;
                        done(null, profile)
                    });
                }
            })
        }
    )
);