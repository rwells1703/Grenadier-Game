var express = require('express');
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
        yVel: 0,
        grenades: {}
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

    // Update the player state data
    socket.on('thisPlayerThrowGrenade', newGrenade => {
        //console.log(socket.id, ' threw grenade');
        players[socket.id].grenades[newGrenade.grenadeId] = {};
        players[socket.id].grenades[newGrenade.grenadeId].xPos = newGrenade.xPos;
        players[socket.id].grenades[newGrenade.grenadeId].yPos = newGrenade.yPos;
        players[socket.id].grenades[newGrenade.grenadeId].xVel = newGrenade.xVel;
        players[socket.id].grenades[newGrenade.grenadeId].yVel = newGrenade.yVel;

        // Add the extra information of the player id
        // so that other players will know who shot it
        newGrenade.playerId = socket.id;

        // Emit a message to all players about the new grenade
        socket.broadcast.emit('otherPlayerThrowGrenade', newGrenade);
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