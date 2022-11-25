
<template>
    <div style="width:100vw; height: 100vh; overflow: hidden ">
    <canvas @click='e => draw(e)' class="canvas" ref="canvas" :width="size*2" :height="size"></canvas>
    </div>

</template>

<script setup>
import {onMounted, ref} from "vue";

let size = 1000

let angle = Math.PI/6

let iterations = 7

let axiom = '0'

let start_point = [size, size]

let turtle = {
    p: [size, size],
    v: [0,-5]
}

let branches = {
    '0': {rule: '1[+0]-0', color: '#027202'},
    '1': {rule: '11', color: '#2c1d00'},
}

/** @type {{value:HTMLCanvasElement}} */
let canvas = ref()

let draw = (e) => {
    let point = [e.clientX, e.clientY]

    const ctx = canvas.value.getContext('2d');

    let rule =  axiom
    for(let i=0; i<iterations; i++){
        let new_rule = ''
        for(let j=0; j < rule.length; j++){
            let ch = rule.charAt(j);
            if (ch in branches) {
                new_rule += branches[ch].rule
            }else{
                new_rule += ch
            }
        }
        rule = new_rule
    }

    turtle = {
        p: point,
        v: [0,-5]
    }

    ctx.beginPath();

    let stack = []
    for(let j=0; j < rule.length; j++){
        let ch = rule.charAt(j);

        if (ch in branches) {
            ctx.beginPath();
            ctx.moveTo(...turtle.p);
            ctx.strokeStyle = branches[ch].color;
            turtle.p[0] += turtle.v[0]
            turtle.p[1] += turtle.v[1]
            ctx.lineTo(...turtle.p);
            ctx.stroke();
        }else if (ch==='['){
            stack.push({p:[...turtle.p],v:[...turtle.v]})
        }else if (ch===']'){
            turtle = stack.pop()
        }else if (ch==='+'){
            turtle.v = [
                Math.cos(angle)*turtle.v[0] - Math.sin(angle)*turtle.v[1],
                Math.sin(angle)*turtle.v[0] + Math.cos(angle)*turtle.v[1]
            ]
        }else if (ch==='-'){
            turtle.v = [
                Math.cos(angle)*turtle.v[0] + Math.sin(angle)*turtle.v[1],
                - Math.sin(angle)*turtle.v[0] + Math.cos(angle)*turtle.v[1]
            ]
        }
    }

}


onMounted(()=>{
    // draw()

    // requestAnimationFrame(function step() {
    //     requestAnimationFrame(step)
    // })
})


</script>

<style>

</style>