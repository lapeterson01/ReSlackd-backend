const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const keys = require('./config/keys');
// const cors = require('cors');
require('./services/passport');

const app = express();

// app.use(cors);
app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/getRoutes')(app);
require('./routes/postRoutes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('server is running on port 8080')
});