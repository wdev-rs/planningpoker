<script>

import {state, socket} from "@/socket";
import {uid} from "uid";

const GAME_STATUS_PLAYING = 'paying';
const GAME_STATUS_REVEALED = 'revealed';

export default {
    data() {
        return {
            user_id: null,
            game_id: null,
            name: '',
            points: null,
        }
    },
    mounted() {

        this.game_id = this.$route.params.id;

        this.user_id = sessionStorage.getItem(this.game_id + '_user_id');
        if (sessionStorage.getItem(this.game_id + '_user_name')) {
            this.name = sessionStorage.getItem(this.game_id + '_user_name');
        }


        if (!this.user_id) {
            this.user_id = 'user_' + uid(16);
            sessionStorage.setItem(this.game_id + '_user_id', this.user_id);
        }

        socket.auth = {
            game_id: this.$route.params.id,
            user_id: this.user_id
        };
        socket.connect();


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
                user_id: this.user_id,
                name: this.name
            });

            sessionStorage.setItem(this.game_id + '_user_name', this.name);
        },
        sendPoints() {
            socket.emit('points', {
                user_id: this.user_id,
                name: this.name,
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
        greetings() {
            return state.greetEvents;
        },
        users() {
            return state.users;
        },
        game() {
            return state.game
        },
        isRevealed() {
            return state.game.status === GAME_STATUS_REVEALED;
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
        <div>
            <button @click="reveal">Reveal</button>
        </div>
        <div>
            <button @click="reset">Reset</button>
        </div>

        <div>Players</div>
        <div v-for="user in users">
            <span>{{ user.name }}</span><span v-if="isRevealed"> : {{ user.points }}</span><span
            v-else>{{ user.points > 0 ? '*' : '' }}</span>
        </div>
    </main>
</template>
