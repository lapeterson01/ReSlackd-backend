# ReSlackd - Backend

Heyyo! [**ReSlackd (Slack clone)**](https://github.com/lapeterson01/ReSlackd-backend) is built with [**React**](https://facebook.github.io/react/), [**Node**](https://nodejs.org), [**Express**](http://expressjs.com/) and [**Socket.io**](http://socket.io/). Demo is available [**here**](https://chat-server-heroku.herokuapp.com/).

## Installation and Usage

1. `git clone https://github.com/lapeterson01/ReSlackd-backend your-folder`
2. `cd your-folder`
3. `npm install`
4. `node index.js` to run backend server (Don't forget to run the SQL file to create your own Database)
4. Replace `var socket = io.connect('https://chat-server-heroku.herokuapp.com/');` with `var socket = io.connect('http://localhost:8080/');`
5. `npm start` to run client side

P.S. In order to run a node on a different port, use `PORT=8080 node index.js`.

## Credits

* [Austin Stevens](https://github.com/aestevens)
* [Ashley Hardin](https://github.com/ahhardin)
* [Jorge Rodriguez](https://github.com/rodri0315)
* [Justin McCarty](https://github.com/jamccarty99)
* [Megan Ruthh](https://github.com/mruthh)
* [Logan Peterson](https://github.com/lapeterson01)
* [Wes Jourdan](https://github.com/WesJourdan)
