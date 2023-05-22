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

    games[id] = {};
    res.send({id: id});
});

app.use('/', express.static('public'))
app.use('/game/:id', express.static('public'))
app.use('/about', express.static('public'))

io.on('connection', (socket) => {
    console.log('a user connected id='+socket.id);

    let game_id = socket.handshake.auth.game_id,
        user_id = socket.handshake.auth.user_id;

    if(!games.hasOwnProperty(game_id)) {
        return;
    }

    if(!games[game_id].hasOwnProperty(user_id)) {
        games[game_id][user_id] = {name: null, points: null}
    }

    let currentGame = games[game_id];

    socket.join(socket.handshake.auth.game_id);
    io.to(game_id).emit("users", currentGame);

    socket.on('join', (...args) => {
        let data = args.pop(),
            name = data.name,
            user_id = socket.handshake.auth.user_id;

        io.to(game_id).emit("greet", "Hi "+name);
        games[game_id][user_id] = {user_id: user_id, name: name, points: null};
        io.to(game_id).emit("users", currentGame);
    });

    socket.on("points", (...args) => {
        let currentUser = args.pop();
        games[game_id][currentUser.user_id] = currentUser;
        io.to(game_id).emit("users", currentGame);
    });

    socket.on("reveal", (...args) => {
        io.to(game_id).emit("reveal");
    });

    socket.on("reset", (...args) => {
        currentGame = games[game_id];

        for(let key in currentGame) {
            currentGame[key].points = null;
        }

        games[game_id] = currentGame;

        io.to(game_id).emit("reset");
        io.to(game_id).emit("users", currentGame);
    });


    socket.on('disconnect', () => {
        socket.leave(socket.handshake.auth.game_id)
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});