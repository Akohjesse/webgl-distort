<script setup>
import Landing from "./components/landing.vue";
import { displacementSlider } from "./animations/slider";
import { onMounted } from "vue";


onMounted(() => {
    displacementSlider();
})
</script>

<template>
    <Landing />
</template>

<style scoped></style>
