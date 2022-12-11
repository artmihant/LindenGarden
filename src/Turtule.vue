<template>

</template>

<script setup>
import { defineProps } from 'vue'

// Компонент, отвечающий за рендеринг единичной L - системы.
// Принимает аксиому, правила, итерацию, угол, направление.

const props = defineProps({
    program: String,
    angle: Number,
    direction: Array,
    rules: Object,
})


</script>