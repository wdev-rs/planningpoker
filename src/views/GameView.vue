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
            showModal: false,
            bonusPoint: null,
            darkMode: false,
            shake_it_player_id: null
        }
    },
    mounted() {

        this.game_id = this.$route.params.id;

        this.selectBonusPoint();

        this.player_id = sessionStorage.getItem(this.game_id + '_player_id');
        if (sessionStorage.getItem(this.game_id + '_player_name')) {
            this.name = sessionStorage.getItem(this.game_id + '_player_name');
        }


        if (!this.player_id) {
            this.player_id = uid(16);
            sessionStorage.setItem(this.game_id + '_player_id', this.player_id);
        }

        this.darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
        this.setDarkMode(this.darkMode);

        socket.auth = {
            game_id: this.$route.params.id,
            player_id: this.player_id
        };
        socket.connect();

        if (this.name) {
            this.joinGame();
        } else {
            this.showModal = true;
        }

        socket.on("reveal", (...args) => {
            state.game.status = GAME_STATUS_REVEALED;
        });

        socket.on("reset", (...args) => {
            this.points = null;
            this.selectBonusPoint();
            state.game.status = GAME_STATUS_PLAYING;
        });

        socket.on('shake', (...args) => {
            this.shake_it_player_id = args.pop();
            if (this.shake_it_player_id === this.player_id && this.points === null) {
                let text = new SpeechSynthesisUtterance(this.name + ", please point!");
                speechSynthesis.speak(text);
            }

            setTimeout(() => this.shake_it_player_id = null, 1000);
        });

        socket.on('clock', (from_player_id, to_player_id) => {

            if (this.points !== null) {
                return;
            }

            let leftFrom = window.scrollX + this.$refs[from_player_id][0].$el.getBoundingClientRect().left;
            let topFrom = window.scrollY + this.$refs[from_player_id][0].$el.getBoundingClientRect().top;

            let leftTo = window.scrollX + this.$refs[to_player_id][0].$el.getBoundingClientRect().left;
            let topTo = window.scrollY + this.$refs[to_player_id][0].$el.getBoundingClientRect().top;

            let weapon = this.$refs['weapon-' + this.player_id][0];

            weapon.style.display = 'none';
            weapon.style.left = leftFrom + 25 + 'px';
            weapon.style.top = topFrom + 25 + 'px';
            weapon.style.rotate = '0deg'

            weapon.style.display = 'block';

            setTimeout(() => {
                weapon.style.left = leftTo + 25 + 'px';
                weapon.style.top = topTo + 25 + 'px';
                weapon.style.rotate = (leftFrom > leftTo ? -720 : 720) + 'deg';
            }, 10);

            setTimeout(() => {
                weapon.style.display = 'none';
            }, 1000);
        })
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
            if (this.isRevealed) {
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
            socket.emit('reset');
        },
        selectBonusPoint() {
            let points = ['🍺', '🍨', '☕', '🌮', '🍕', '🍪', '🍫', '🍔', '🍩', '🥞', '🍸'];
            this.bonusPoint = points[Math.floor(Math.random() * points.length)];
        },
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);

            this.setDarkMode(this.darkMode);
        },
        setDarkMode(darkMode) {
            if (darkMode) {
                document.body.style.backgroundColor = '#3C3C3C';
            } else {
                document.body.style.backgroundColor = '#FFF';
            }
        },
        shake(player_id) {
            if (player_id === this.player_id) {
                // Don't shake yourselves
                return;
            }

            if (state.players.hasOwnProperty(player_id) && state.players[player_id]?.points !== null) {
                // Don't shake who already pointed
                return;
            }

            socket.emit('shake', player_id);
        },
        throwClock(to_player_id) {
            socket.emit('clock', this.player_id, to_player_id);
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
            return [1, 2, 3, 5, 8, 13];
        },
    },
}
</script>

<template>
    <main>
        <div class="w3-container w3-padding-top-16 w3-margin-top flexible-container">
            <span v-if="isAdmin">
                    <button class="w3-margin w3-button w3-large w3-round-large w3-green" @click="reveal">Reveal</button>
                    <button class="w3-margin w3-button w3-large w3-round-large w3-blue" @click="reset">Restart</button>
             </span>
            <button
                class="w3-margin w3-button w3-large w3-white w3-border w3-border-green w3-round-large  w3-text-green"
                @click="showModal=true">Change my name
            </button>
            <button class="w3-margin w3-button w3-large w3-border w3-border-green w3-round-large  w3-text-green"
                    :class="{'w3-white': darkMode, 'w3-black': !darkMode }" @click="toggleDarkMode">
                {{ !darkMode ? 'Dark mode' : 'Light mode' }}
            </button>
        </div>

        <div id="id01" class="w3-modal" :style="showModal ? 'display: block' : 'display: none'">
            <div class="w3-modal-content w3-round" style="max-width:450px">
                <div class="w3-container">
      <span @click="showModal = false;"
            class="w3-button w3-display-topright">&times;</span>
                    <div class="w3-section">
                        <label><b>Enter your name</b></label>
                        <input class="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter your name"
                               name="playername" required v-model="name"
                               @keyup.enter="showModal = false; this.joinGame()">
                        <button @click="showModal = false; this.joinGame()"
                                class="w3-button w3-block w3-green w3-section w3-padding w3-round" type="submit">Join
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="w3-container w3-margin-top w3-padding-32 flexible-container">
            <div v-for="player in players" class="card-container w3-container w3-margin-top">
                <div :ref="'weapon-'+player.player_id" class="weapon move-animation">
                    ⏱
                </div>

                <div class="relative">
                    <div v-if="player.player_id !== player_id && player.points === null" class="notifiers">
                    <span
                        @click="throwClock(player.player_id)"
                        class="move-animation"
                    >⏱
                    </span>
                        <span @click="shake(player.player_id)">📣</span>
                    </div>
                    <card :ref="player.player_id" @click=""
                          :class="this.shake_it_player_id === player.player_id ? 'shake' : ''" :name="player.name"
                          style="cursor: auto"
                          :points="player.points" :is-revealed="this.isRevealed"
                          :is-ready="player.points" :is-my-card="player.player_id === this.player_id">
                    </card>
                </div>
            </div>
        </div>

        <div class="w3-container w3-row w3-margin-top w3-padding-64 flexible-container">
            <div v-for="point in selectablePoints" class="w3-container w3-margin-top">
                <card name="" :points="point" @point-selected="setPoints" :is-selected="this.points === point"
                      is-revealed="true" :is-bottom-card="true"></card>
            </div>
            <div class="w3-container w3-margin-top">
                <card name="" :points="bonusPoint" @point-selected="setPoints" :is-selected="this.points === bonusPoint"
                      is-revealed="true"></card>
            </div>
        </div>
    </main>
</template>

<style scoped>
.flexible-container {
    display: flex;
    flex-wrap: wrap
}

@keyframes tilt-shaking {
    0% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(5deg);
    }
    50% {
        transform: rotate(0deg);
    }
    75% {
        transform: rotate(-5deg);
    }
    100% {
        transform: rotate(0deg);
    }
}

.shake {
    animation: tilt-shaking 0.25s linear;
    animation-iteration-count: 3;
}

.weapon {
    display: none;
    position: absolute;
    z-index: 10;
    font-size: 6rem;
}

.move-animation {
    transition-property: left, top, rotate;
    transition-duration: 0.5s;
    transition-timing-function: ease-in;
}

.notifiers {
    display: none;
    left: 5px;
    bottom: 5px;
    border-radius: 5px;
    position: absolute;
    font-size: 1.5rem;
    padding: 10px;
    cursor: pointer;
    background-color: rgba(200, 200, 200, 0.4);
    width: 136px;
}

.relative {
    position: relative;
}

.card-container:hover .notifiers {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

</style>
