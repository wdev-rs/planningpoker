<script>

import {state, socket} from "@/socket";
import {uid} from "uid";

const GAME_STATUS_PLAYING = 'paying';
const GAME_STATUS_REVEALED = 'revealed';

export default {
    data() {
        return {
            player_id: null,
            game_id: null,
            name: '',
            points: null,
        }
    },
    mounted() {

        this.game_id = this.$route.params.id;

        this.player_id = sessionStorage.getItem(this.game_id + '_player_id');
        if (sessionStorage.getItem(this.game_id + '_player_name')) {
            this.name = sessionStorage.getItem(this.game_id + '_player_name');
        }


        if (!this.player_id) {
            this.player_id = uid(16);
            sessionStorage.setItem(this.game_id + '_player_id', this.player_id);
        }

        socket.auth = {
            game_id: this.$route.params.id,
            player_id: this.player_id
        };
        socket.connect();

        if(this.name) {
            this.joinGame();
        }

        socket.on("reveal", (...args) => {
            state.game.status = GAME_STATUS_REVEALED;
        });

        socket.on("reset", (...args) => {
            this.points = null;
            state.game.status = GAME_STATUS_PLAYING;
        });
    },
    methods: {
        joinGame() {
            socket.emit('join', {
                name: this.name
            },(response) => {
                state.isAdmin = response.isAdmin
            });

            sessionStorage.setItem(this.game_id + '_player_name', this.name);
        },
        sendPoints() {
            socket.emit('points', {
                points: this.points
            });
        },
        reveal() {
            socket.emit('reveal');
        },
        reset() {
            this.points = null;
            socket.emit('reset');
        }
    },
    computed: {
        connected() {
            return state.connected;
        },
        players() {
            return state.players;
        },
        game() {
            return state.game
        },
        isRevealed() {
            return state.game.status === GAME_STATUS_REVEALED;
        },
        isAdmin() {
            return state.isAdmin;
        }
    }
}
</script>

<template>
    <main>
        <div>Gameee id={{ $route.params.id }} <a href="/">End the game</a></div>
        <div>
            <label for="name">Name: </label>
            <input type="text" v-model="name">
            <button @click="joinGame">Join</button>
        </div>
        <div v-if="!isRevealed">
            <label for="name">Point: </label>
            <input type="text" v-model="points">
            <button @click="sendPoints">Send</button>
        </div>
        <div v-if="isAdmin">
            <div>
                <button @click="reveal">Reveal</button>
            </div>
            <div>
                <button @click="reset">Reset</button>
            </div>
        </div>
        <div>Players</div>
        <div v-for="user in players">
            <span>{{ user.name }}</span><span v-if="isRevealed"> : {{ user.points }}</span><span
            v-else>{{ user.points > 0 ? '*' : '' }}</span>
        </div>
    </main>
</template>
