<script>
    import {VERSION} from '../../version';

    export default {
        data() {
            return {
                version: VERSION
            }
        }
        }
</script>

<template>
  <div class="w3-containter w3-padding-64 w3-center">
    <h1>Planning poker by <a href="https://www.wdev.rs" target="_blank">WDev</a></h1>
    <p>v{{version}}</p>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
