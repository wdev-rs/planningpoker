<script>

import {state, socket} from "@/socket";
import {uid} from "uid";
import Card from "@/components/Card.vue";

const GAME_STATUS_PLAYING = 'paying';
const GAME_STATUS_REVEALED = 'revealed';

export default {
    components: {
        Card
    },
    data() {
        return {
            player_id: null,
            game_id: null,
            name: '',
            points: null,
            showModal: false
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

        if (this.name) {
            this.joinGame();
        }
        else {
            this.showModal = true;
        }

        socket.on("reveal", (...args) => {
            state.game.status = GAME_STATUS_REVEALED;
        });

        socket.on("reset", (...args) => {
            this.selecteblePoints = null;
            state.game.status = GAME_STATUS_PLAYING;
        });
    },
    methods: {
        joinGame() {
            socket.emit('join', {
                name: this.name
            }, (response) => {
                state.isAdmin = response.isAdmin
            });

            sessionStorage.setItem(this.game_id + '_player_name', this.name);
        },
        sendPoints() {
            socket.emit('points', {
                points: this.points
            });
        },
        setPoints(points) {
            if(this.isRevealed) {
                return;
            }

            if (this.points != points) {
                this.points = points;
            } else {
                this.points = null;
            }

            this.sendPoints();
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
        },
        selectablePoints() {
            return [1, 2, 3, 5, 8, 13]
        }
    }
}
</script>

<template>
    <main>
        <div class="w3-container w3-auto w3-margin-top">
            <div class="w3-row" v-if="isAdmin">
                <div class="w3-col l2">
                    <button class="w3-button w3-xlarge w3-round-xlarge w3-green" @click="reveal">Reveal</button>
                </div>
                <div class="w3-col l2">
                    <button class="w3-button w3-xlarge w3-round-xlarge w3-blue" @click="reset">Restart</button>
                </div>
                <div class="w3-col l2">
                    <a href="/" class="w3-button w3-xlarge w3-round-xlarge w3-red">End the game</a>
                </div>
            </div>
        </div>

        <div id="id01" class="w3-modal" :style="showModal ? 'display: block' : 'display: none'">
            <div class="w3-modal-content w3-round">
                <div class="w3-container">
      <span onclick="document.getElementById('id01').style.display='none'"
            class="w3-button w3-display-topright">&times;</span>
                    <div class="w3-section">
                        <label><b>Name</b></label>
                        <input class="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter name" name="usrname" required v-model="name">
                        <button @click="showModal = false; this.joinGame()" class="w3-button w3-block w3-green w3-section w3-padding w3-round" type="submit">Join</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="w3-container w3-auto w3-margin-top">
            <div v-for="player in players" class="w3-container w3-cell">
                <card :name="player.name" :points="player.points" :is-revealed="this.isRevealed" :is-ready="player.points"></card>
            </div>
        </div>

        <div class="w3-container w3-auto w3-margin-top">
            <div v-for="point in selectablePoints" class="w3-container w3-cell">
                <card name="" :points="point" @point-selected="setPoints" :is-selected="this.points === point" is-revealed="true"></card>
            </div>
        </div>
    </main>
</template>
