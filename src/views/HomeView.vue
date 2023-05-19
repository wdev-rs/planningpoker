<script>

import {state, socket} from "@/socket";
import axios from "axios";

export default {
    data() {
        return {
            greeting: 'Hello World!',
            url: ''
        }
    },
    mounted() {
    },
    methods: {
        generateGame() {
            axios.post('http://localhost:3000/generate').then(
                (response) => {
                    console.log(response)
                    this.url = '/game/'+response.data.id;
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
