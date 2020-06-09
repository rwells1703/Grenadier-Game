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
    // Populate the list of players for the new client
    for (let playerId of Object.keys(players)) {
        socket.emit('otherPlayerAdd', players[playerId]);
    }

    // Create the new player object
    players[socket.id] = {
        id: socket.id,
        xPos: 128,
        yPos: 128,
        xVel: 0,
        yVel: 0
    };

    console.log(socket.id, ' joined (', Object.keys(players).length,')');

    socket.emit('thisPlayerJoin', players[socket.id]);

    // Update all the current players that this player has joined
    socket.broadcast.emit('otherPlayerAdd', players[socket.id]);

    socket.emit('play');

    // Update the player state data
    socket.on('thisPlayerMove', movementUpdate => {
        //console.log(socket.id + ' moved');
        players[socket.id].xPos = movementUpdate.xPos;
        players[socket.id].yPos = movementUpdate.yPos;
        players[socket.id].xVel = movementUpdate.xVel;
        players[socket.id].yVel = movementUpdate.yVel;

        // emit a message to all players about the player that moved
        socket.broadcast.emit('otherPlayerMove', players[socket.id]);
    });

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
        delete players[socket.id];

        console.log(socket.id, ' left (', Object.keys(players).length,')');

        // Inform the current players that this player has left
        socket.broadcast.emit('otherPlayerLeave', socket.id);
    });
});


var port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});