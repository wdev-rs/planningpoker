<script>

import {state, socket} from "@/socket";
import axios from "axios";
import {uid} from "uid";

export default {
    data() {
        return {
            greeting: 'Hello World!',
            url: '',
            player_id: null,
        }
    },
    mounted() {
    },
    methods: {
        generateGame() {

            if (!this.player_id) {
                this.player_id = uid(16);
            }

            axios.post('/generate', {
                player_id: this.player_id
            }).then(
                (response) => {
                    console.log(response)
                    this.url = '/game/'+response.data.id;
                    sessionStorage.setItem(response.data.id + '_player_id', this.player_id);
                    state.isAdmin = true;
                    this.$router.push('/game/'+response.data.id);
                });
        }
    },
    computed: {
        connected() {
            return state.connected;
        },
    }
}
</script>

<template>
  <main>
      <div class="w3-container w3-auto w3-center w3-margin-top w3-padding-64">
          <h1>Welcome to the planning poker.</h1>
          <p>To start a new game, click on the button below.</p>
          <button class="w3-button w3-xlarge w3-round-xlarge w3-green" @click="generateGame">Start new game</button>
      </div>
  </main>
</template>
