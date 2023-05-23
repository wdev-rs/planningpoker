const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }});

const uid = require('uid').uid;

app.use(express.json());

let games = {};

app.post('/generate', (req, res) => {
    const id = uid(16);

    games[id] = {
        admin_id: req.body.player_id,
        players: {}
    };

    res.send({id: id});
});

app.use('/', express.static('public'))
app.use('/game/:id', express.static('public'))
app.use('/about', express.static('public'))

io.on('connection', (socket) => {
    let game_id = socket.handshake.auth.game_id;

    if(!games.hasOwnProperty(game_id)) {
        socket.disconnect();
        return;
    }

    let currentGame = games[game_id];

    socket.join(socket.handshake.auth.game_id);
    io.to(game_id).emit("players", currentGame.players);

    socket.on('join', (data, callback) => {
        let name = data.name,
            player_id = socket.handshake.auth.player_id;

        games[game_id].players[player_id] = {player_id: player_id, name: name, points: null};
        io.to(game_id).emit("players", currentGame.players);

        callback({
            isAdmin: socket.handshake.auth.player_id ===  games[game_id].admin_id
        });
    });

    socket.on("points", (...args) => {
        let data = args.pop();
        games[game_id].players[socket.handshake.auth.player_id].points = data.points;
        io.to(game_id).emit("players", currentGame.players);
    });

    socket.on("reveal", (...args) => {
        if(games[game_id].admin_id === socket.handshake.auth.player_id) {
            io.to(game_id).emit("reveal");
        }
    });

    socket.on("reset", (...args) => {
        if(games[game_id].admin_id === socket.handshake.auth.player_id) {
            currentGame = games[game_id];

            for (let key in currentGame.players) {
                currentGame.players[key].points = null;
            }

            games[game_id] = currentGame;

            io.to(game_id).emit("reset");
            io.to(game_id).emit("players", currentGame.players);
        }
    });


    socket.on('disconnect', () => {
        socket.leave(socket.handshake.auth.game_id);
        delete games[socket.handshake.auth.game_id].players[socket.handshake.auth.player_id];
        io.to(game_id).emit("players", games[socket.handshake.auth.game_id].players);
    });
});

server.listen(3001, () => {
    console.log('listening on *:3000');
});