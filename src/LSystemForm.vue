<template>
  <div class="control" style="min-width:300px; padding: 10px">
    <p>
      <select :value="chosen" @change="onPresetChange">
        <option :key='i' v-for="(f,i) in figureCollection" :value="i">{{f.name}}</option>
      </select>
    </p>
    <p>
      Итерация: {{model.iterations}}
      <input type="range" style="width:90%" min="0" :max="model.iterations_max" step="0.1" v-model="model.iterations" @input="emitUpdate">
    </p>
    <p>
      Угол: {{model.stepAngle}}
      <input type="range" style="width:90%" min="0" max="180" step="1" v-model="model.stepAngle" @input="emitUpdate">
    </p>
    <p>
      Начало: <input v-model="model.axiom" @input="emitUpdate">
    </p>
    <div style="display: flex; align-items: center;justify-content: center;">
      <table>
        <tr v-for="key in Object.keys(model.rules)" :key="key">
          <td>{{key}}</td>
          <td><input v-model="model.rules[key]" @input="emitUpdate"></td>
          <td><input type="color" v-model="model.specialDrawOptions[key].color" @input="emitUpdate"></td>
          <td><input type="number" v-model="model.specialDrawOptions[key].lineWidth" @input="emitUpdate"></td>
          <td><input type="number" v-model="model.specialDrawOptions[key].step" @input="emitUpdate"></td>
        </tr>
      </table>
    </div>
    <p>
      Размер <input style="width:30px" v-model="model.power" @input="emitUpdate"> ^ {{ model.iterations }}
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
// Убираем ref для chosen, используем props.chosen напрямую

function emitUpdate() {
  emit('update:model', model.value);
}

function onPresetChange(event: Event) {
  // Получаем выбранный индекс из select
  const val = Number((event.target as HTMLSelectElement).value);
  emit('update:chosen', val);
  emit('preset-change', val);
}
</script>

<style scoped>
.control {
  border: 1px solid;
  border-radius: 5px;
  background-color: rgba(255,255,255,0.8);
}
</style> 