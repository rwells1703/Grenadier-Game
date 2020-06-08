var express = require('express');
var fs = require('fs')
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
    console.log(socket.id, ' joined');

    // Populate the list of players for the new client
    for (let playerId of Object.keys(players)) {
        socket.emit('otherPlayerUpdate', players[playerId]);
    }

    // Create the new player object
    players[socket.id] = {
        id: socket.id,
        xPos: 100,
        yPos: 100,
        xVel: 0,
        yVel: 0,
        grenades: {}
    };

    socket.emit('thisPlayerJoin', players[socket.id]);

    // Update all the current players that this player has joined
    socket.broadcast.emit('otherPlayerUpdate', players[socket.id]);

    socket.emit('play');

    // Update the player state data
    socket.on('thisPlayerUpdate', playerUpdate => {
        console.log(socket.id + ' sent update');
        players[socket.id].xPos = playerUpdate.xPos;
        players[socket.id].yPos = playerUpdate.yPos;
        players[socket.id].xVel = playerUpdate.xVel;
        players[socket.id].yVel = playerUpdate.yVel;
        players[socket.id].grenades = playerUpdate.grenades;

        // emit a message to all players about the player that moved
        socket.broadcast.emit('otherPlayerUpdate', players[socket.id]);
    });

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
        console.log(socket.id, ' left');
        delete players[socket.id];

        // Inform the current players that this player has left
        socket.broadcast.emit('removeOtherPlayer', socket.id);
    });
});


var port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});