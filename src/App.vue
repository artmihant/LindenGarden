
<template>
    <canvas class="canvas" ref="canvas" :width="size*2" :height="size*2"></canvas>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {parast} from "./cfd.js";

let size = 180

let angle = 30

let iterations = 3

let axiom = '0'

let start_point = [size, size]

let branches = {
    '0': {rule: '1[+0]-0', color: '#027202'},
    '1': {rule: '11', color: '#2c1d00'},
}

/** @type {{value:HTMLCanvasElement}} */
let canvas = ref()

let draw = () => {
    const ctx = canvas.value.getContext('2d');

    ctx.clearRect(0, 0, size*2, size*2);

    if (rank.value && view_line.value){
        ctx.strokeStyle = "rgb(255,165,0)";
        ctx.beginPath();
        points.forEach((point,i) => {if (i%rank.value === 0) ctx.lineTo(...point)})
        ctx.stroke();
    }
}


onMounted(()=>{
    requestAnimationFrame(function step() {
        draw()
        requestAnimationFrame(step)
    })
})


</script>

<style>
.top-control{
    top:0;
    left:0;
    width: 100vw;
    position: absolute;
}
.bottom-control{
    bottom:0;
    left:0;
    width: 100vw;
    position: absolute;
}

.spiral{
    border: 1px #472f28 solid;
    border-radius: 5px;
    margin-left:3px;
    margin-top:3px;
    cursor:pointer;
    background-color: #ffe445;
    color: #472f28;
    padding: 3px;
}
.spiral.active {
    color: #ffe445;
    background-color: #472f28;
}

.num{
    width: 70px !important;
}
</style>