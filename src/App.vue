<template>
    <div ref="canvas" style="width:100vw; height: 100vh;"></div>
    <div class="control" style="position:absolute; bottom:0; left: 0; width:100%">
        <p>Итерация: {{figure.iterations}}<input type="range" style="width:90%" min="0" max="7" step="1" v-model="figure.iterations"  @input="update"  > </p>

        <p>Угол: {{figure.angle}}<input type="range" style="width:90%" min="0" max="180" step="1" v-model="figure.angle"  @input="update"  > </p>

        <p> Начало: <input v-model="figure.axiom" @input="update"> </p>

        <table>
            <tr v-for="key in figure.rules" :key="key">
                <td><input type="color" v-model="figure.branches[key].color" @input="update"></td>
                <td>{{key}}</td>
                <td><input v-model="figure.branches[key].replace" @input="update"></td>
            </tr>
        </table>


    </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import Two from "two.js";
import Figure from "./figure.js";

let canvas = ref(null)

let ctx = new Two({
    fullscreen: true
})

let figure = reactive(new Figure())

onMounted(()=>{

    ctx.appendTo(canvas.value);

    figure.setCanvas(ctx)

    figure.start.x = ctx.width * 0.5
    figure.start.y = ctx.height * 0.5

    update()
})

let update = () => {
    ctx.clear()
    figure.draw()
    ctx.update();
}

</script>

<style>

</style>