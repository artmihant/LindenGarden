<template>
    <div ref="canvas" style="width:100vw; height: 100vh;"></div>
    <div class="control" style="position:absolute; top:0; left:0; min-width:300px; padding: 10px">
        <div v-show="showControls" style="transition: display 1s ease-out; border: 1px solid; border-radius: 5px; background-color: rgba(255,255,255,0.8)">

            <p>
            <select v-model="chosen">
                <option :key='i' v-for="(f,i) in figure_collection" :value="i">{{f.name}}</option>
            </select>
            </p>

            <p>Итерация: {{figure.iterations}}<input type="range" style="width:90%" min="0" :max="figure.iterations_max" step="1" v-model="figure.iterations"  @input="update">
            </p>

            <p>Угол: {{figure.angle}}<input type="range" style="width:90%" min="0" max="180" step="1" v-model="figure.angle"  @input="update"  > </p>

            <p> Начало: <input v-model="figure.axiom" @input="update"> </p>

            <div style="display: flex; align-items: center;justify-content: center;">
                <table>
                    <tr v-for="key in figure.keys" :key="key">
                        <td>{{key}}</td>
                        <td><input v-model="figure.rules[key].replace" @input="update"></td>
                        <td><input type="color" v-model="figure.rules[key].color" @input="update"></td>
                        <td><input type="checkbox" v-model="figure.rules[key].draw" @change="update"></td>
                    </tr>
                </table>
            </div>
            <p>Размер <input style="width:30px" v-model="figure.diameter" @input="update"> ^ <input style="width:30px" v-model="figure.power" @input="update">({{figure.elements_count}})</p>

        </div>

        <div style="cursor: pointer" @click="showControls = !showControls">{{showControls ? '▲' : '▼'}}</div>

    </div>

</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import Two from "two.js";
import Figure from "./figure.js";
import {figure_collection} from "./figure_collection.js";


let chosen = ref(0)
let item = localStorage.getItem('figure')
if(item){
    figure_collection[0] = JSON.parse(localStorage.getItem('figure'))
}

let figure = reactive(new Figure(figure_collection[chosen.value]))

let canvas = ref(null)

let ctx = new Two({
    fullscreen: true,
    type: Two.Types.canvas
})

let showControls = ref(true)

watch(chosen, () => {
    if(chosen.value){
        figure.update(figure_collection[chosen.value])
    }else{
        let item = localStorage.getItem('figure')
        if(item){
            figure.update(JSON.parse(item))
        }
    }
    update()
})

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
    figure.save()
    ctx.update();
}

</script>

<style>

</style>