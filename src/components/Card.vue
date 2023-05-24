<script>
export default {
    props: {
        points: null,
        name: "Anonymous",
        isSelected: false,
        isRevealed: false,
        isReady: false,
        isMyCard: false,
        isBottomCard: false,
    }
}
</script>


<template>
    <div class="w3-card w3-yellow w3-round-large card"
         :class="{selected: isSelected, 'w3-border w3-border-green': isMyCard, 'bottom-card': isBottomCard}"

         @click="$emit('point-selected', points)"
    >

        <header class="w3-container w3-center">
            <h4>{{ name ? name : '&nbsp' }}</h4>
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

    .bottom-card{
    }

    .card{
        height: 200px;
        width: 145px;
        cursor: pointer;
    }

    .points {
        font-size: 4.5em;
    }

    .selected {
        margin-top: -15px;
    }
</style>