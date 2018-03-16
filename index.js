const express = require('express');
const socket = require('socket.io');

const app = express();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('server is running on port 8080')
});