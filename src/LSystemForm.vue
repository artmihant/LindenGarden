<template>
  <div class="control" style="min-width:300px; padding: 10px">
    <p>
      <select v-model="chosen" @change="onPresetChange">
        <option :key='i' v-for="(f,i) in figureCollection" :value="i">{{f.name}}</option>
      </select>
    </p>
    <p>
      Итерация: {{model.iterations}}
      <input type="range" style="width:90%" min="0" :max="model.iterations_max" step="1" v-model="model.iterations" @input="emitUpdate">
    </p>
    <p>
      Угол: {{model.angle}}
      <input type="range" style="width:90%" min="0" max="180" step="1" v-model="model.angle" @input="emitUpdate">
    </p>
    <p>
      Начало: <input v-model="model.axiom" @input="emitUpdate">
    </p>
    <div style="display: flex; align-items: center;justify-content: center;">
      <table>
        <tr v-for="key in model.keys" :key="key">
          <td>{{key}}</td>
          <td><input v-model="model.rules[key]" @input="emitUpdate"></td>
          <td><input type="color" v-model="model.rules[key].color" @input="emitUpdate"></td>
          <td><input type="checkbox" v-model="model.rules[key].draw" @change="emitUpdate"></td>
        </tr>
      </table>
    </div>
    <p>
      Размер <input style="width:30px" v-model="model.diameter" @input="emitUpdate"> ^
      <input style="width:30px" v-model="model.power" @input="emitUpdate">
      ({{model.elements_count}})
    </p>
  </div>
</template>

<script setup lang="ts">

import {ref, watch, toRefs} from 'vue';

const props = defineProps({
  model: { type: Object, required: true },
  figureCollection: { type: Array, required: true },
  chosen: { type: Number, required: true }
});
const emit = defineEmits(['update:model', 'update:chosen', 'preset-change']);

const { model, figureCollection } = toRefs(props);
let chosen = ref(props.chosen);

watch(chosen, (val) => {
  emit('update:chosen', val);
});

function emitUpdate() {
  emit('update:model', model.value);
}

function onPresetChange() {
  emit('preset-change', chosen.value);
}
</script>

<style scoped>
.control {
  border: 1px solid;
  border-radius: 5px;
  background-color: rgba(255,255,255,0.8);
}
</style> 