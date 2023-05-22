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

            axios.post('http://localhost:3000/generate', {
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
      <div>
          Planning poker is connected={{ connected }}

          <button @click="generateGame">Generate game</button>

          <a :href="url">Url</a>
      </div>
  </main>
</template>
