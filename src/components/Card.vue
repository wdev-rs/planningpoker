<script>
export default {
    props: {
        points: null,
        name: "Anonymous",
        isSelected: false,
        isRevealed: false,
        isReady: false,
    }
}
</script>


<template>
    <div class="card w3-card w3-yellow w3-round-large" :class="{selected: isSelected}" @click="$emit('point-selected', points)">
        <header class="w3-container w3-center">
            <h1>{{ name ? name : '&nbsp' }}</h1>
        </header>

        <div v-if="isRevealed" class="w3-container w3-center">
            <span class="points">{{points ? points : '?'}}</span>
        </div>
        <div v-else class="w3-container w3-center">
            <span v-if="isReady" class="points">👍</span>
        </div>
    </div>
</template>

<style scoped>
    .card{
        min-height: 200px;
        min-width: 150px;
    }

    .points {
        font-size: 5em;
    }

    .selected {
        margin-top: -15px;
    }
</style>