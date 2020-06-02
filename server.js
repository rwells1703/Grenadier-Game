var express = require('express');
var fs = require('fs')
//var https = require('https');
var http = require('http');
var socketio = require('socket.io');


var app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.use('/js', express.static('js'));
app.use('/assets', express.static('assets'));

var server = http.createServer(app);


var players = {};

var io = socketio.listen(server);

io.on('connection', socket => {
    console.log('user connected', socket.id);

    // Populate the list of players for the new client
    for (let playerId of Object.keys(players)) {
        socket.emit('addOtherPlayer', players[playerId]);
    }

    // Create the new player object
    players[socket.id] = {
        id: socket.id,
        x: 100,
        y: 100,
        direction: 'R'
    };

    socket.emit('addThisPlayer', players[socket.id]);

    // Update all the current players that this player has joined
    socket.broadcast.emit('addOtherPlayer', players[socket.id]);

    socket.emit('play');

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];

        // Inform the current players that this player has left
        io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('sendPlayerMoved', newState => {
        players[socket.id].x = newState.x;
        players[socket.id].y = newState.y;
        players[socket.id].direction = newState.direction;

        // emit a message to all players about the player that moved
        socket.broadcast.emit('receivePlayerMoved', players[socket.id]);
    });
});


var port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});