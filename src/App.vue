<template>
    <div style="width:100vw; min-height: 100vh;">
        <LSystemForm
            :model="figure"
            :figureCollection="figure_collection"
            :chosen="chosen"
            @update:model="onModelUpdate"
            @update:chosen="onChosenUpdate"
            @preset-change="onPresetChange"
            v-show="showControls"
            style="position:absolute; top:0; left:0;"
        />
        <div style="cursor: pointer; position:absolute; top:0; left:0; min-width:300px; padding: 10px" @click="showControls = !showControls">{{showControls ? '▲' : '▼'}}</div>
        <div style="margin-left:320px; padding:20px;">
            {{ figure.rule }}
        </div>
    </div>
</template>

<script setup lang="ts">
import LSystemForm from '@/LSystemForm.vue';

import {onMounted, reactive, ref, watch} from "vue";
import LSystemModel from '@/figure.js';
import {figure_collection} from '@/figure_collection.js';

let chosen = ref(0)
let item = localStorage.getItem('figure')

if(item){
    figure_collection[0] = JSON.parse(localStorage.getItem('figure'))
}

let figure = reactive(new LSystemModel(figure_collection[chosen.value]))

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
})

function onModelUpdate(newModel) {
    figure.update(newModel)
}

function onChosenUpdate(newChosen) {
    chosen.value = newChosen
}

function onPresetChange(newChosen) {
    if(newChosen){
        figure.update(figure_collection[newChosen])
    }else{
        let item = localStorage.getItem('figure')
        if(item){
            figure.update(JSON.parse(item))
        }
    }
}

</script>

<style>
</style>