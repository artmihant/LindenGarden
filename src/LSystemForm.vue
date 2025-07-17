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
    <div class="rules-cards-container">
      <div v-for="key in Object.keys(model.rules)" :key="key" class="rule-card">
        <div class="rule-card-header">
          <label>Символ:
            <input v-model="symbolInputs[key]" @change="onSymbolChange(key, symbolInputs[key])" class="symbol-input" maxlength="1"/>
          </label>
          <button class="remove-btn" @click="removeRule(key)" title="Удалить правило">✖</button>
        </div>
        <div class="rule-card-row">
          <label>Правило:
            <textarea v-model="model.rules[key]" @input="emitUpdate" class="rule-input"></textarea>
          </label>
        </div>
        <div class="rule-card-row">
          <label>Цвет:
            <input type="color" v-model="model.specialDrawOptions[key].color" @input="emitUpdate" class="color-input">
          </label>
          <label>Толщина:
            <input type="number" v-model="model.specialDrawOptions[key].lineWidth" @input="emitUpdate" class="number-input">
          </label>
          <label>Шаг:
            <input type="number" v-model="model.specialDrawOptions[key].step" @input="emitUpdate" class="number-input">
          </label>
        </div>
      </div>
      <button class="add-btn" @click="addRule">Добавить правило</button>
    </div>
    <p>
      Степень роста: <input style="width:30px" v-model="model.power" @input="emitUpdate"> ^ {{ model.iterations }}
    </p>
  </div>
</template>

<script setup lang="ts">

import {ref, watch, toRefs, reactive, nextTick} from 'vue';

const props = defineProps({
  model: { type: Object, required: true },
  figureCollection: { type: Array, required: true },
  chosen: { type: Number, required: true }
});
const emit = defineEmits(['update:model', 'update:chosen', 'preset-change']);

const { model, figureCollection } = toRefs(props);
// Для редактирования символов
const symbolInputs = reactive({});

// Инициализация symbolInputs при изменении модели
watch(model, (newModel) => {
  Object.keys(newModel.rules).forEach(key => {
    symbolInputs[key] = key;
  });
}, { immediate: true });

function emitUpdate() {
  emit('update:model', model.value);
}

function onPresetChange(event: Event) {
  const val = Number((event.target as HTMLSelectElement).value);
  emit('update:chosen', val);
}

function addRule() {
  // Найти первую свободную заглавную букву
  const used = new Set(Object.keys(model.value.rules));
  let code = 'A'.charCodeAt(0);
  let newKey = '';
  while (used.has(String.fromCharCode(code)) && code <= 'Z'.charCodeAt(0)) code++;
  if (code > 'Z'.charCodeAt(0)) {
    // fallback: число
    let i = 1;
    while (used.has('X'+i)) i++;
    newKey = 'X'+i;
  } else {
    newKey = String.fromCharCode(code);
  }
  model.value.rules[newKey] = '';
  model.value.specialDrawOptions[newKey] = { color: '#000000', lineWidth: 1, step: 1 };
  symbolInputs[newKey] = newKey;
  emitUpdate();
  nextTick(() => {
    // Автофокус на новый символ
    const inputs = document.querySelectorAll('.symbol-input');
    if (inputs.length) (inputs[inputs.length-1] as HTMLInputElement).focus();
  });
}

function removeRule(key: string) {
console.log('removeRule')
  delete model.value.rules[key];
  delete model.value.specialDrawOptions[key];
  delete symbolInputs[key];
  emitUpdate();
}

function onSymbolChange(oldKey: string, newKey: string) {
  newKey = newKey.trim().toUpperCase();
  if (!newKey || oldKey === newKey || model.value.rules[newKey]) {
    // Некорректно или уже есть такой символ
    symbolInputs[oldKey] = oldKey;
    return;
  }
  // Переносим правило и опции
  model.value.rules[newKey] = model.value.rules[oldKey];
  model.value.specialDrawOptions[newKey] = model.value.specialDrawOptions[oldKey];
  symbolInputs[newKey] = newKey;
  // Удаляем старое
  removeRule(oldKey);
  emitUpdate();
}
</script>

<style scoped>
.control {
  border: 1px solid;
  border-radius: 5px;
  background-color: rgba(255,255,255,0.8);
}
.rules-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;
  margin: 0 auto;
}
.rules-table th, .rules-table td {
  border: 1px solid #ccc;
  padding: 4px 6px;
  text-align: center;
}
.rules-table th {
  background: #f5f5f5;
  font-weight: 600;
}
.rules-table tr:nth-child(even) {
  background: #f9f9f9;
}
.rule-input {
  width: 70px;
  font-size: 13px;
  padding: 2px 4px;
}
.color-input {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: none;
}
.number-input {
  width: 45px;
  font-size: 13px;
  padding: 2px 4px;
}
.symbol-input {
  width: 32px;
  text-align: center;
  font-size: 14px;
  padding: 2px 4px;
}
.remove-btn {
  background: none;
  border: none;
  color: #e53935;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.2s;
  line-height: 1;
}
.remove-btn:hover {
  color: #b71c1c;
}
.add-btn {
  margin-top: 8px;
  padding: 4px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #888;
  background: #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #e0e0e0;
}
.rules-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}
.rule-card {
  background: #f8f8fa;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 10px 12px 8px 12px;
  min-width: 210px;
  max-width: 250px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}
.rule-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}
.rule-card-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
}
.symbol-input {
  width: 32px;
  text-align: center;
  font-size: 14px;
  padding: 2px 4px;
  margin-left: 4px;
}
.remove-btn {
  background: none;
  border: none;
  color: #e53935;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.2s;
  line-height: 1;
}
.remove-btn:hover {
  color: #b71c1c;
}
.rule-input {
  width: 80px;
  font-size: 13px;
  padding: 2px 4px;
  margin-left: 4px;
}
.color-input {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: none;
  margin-left: 4px;
}
.number-input {
  width: 45px;
  font-size: 13px;
  padding: 2px 4px;
  margin-left: 4px;
}
.add-btn {
  align-self: flex-start;
  margin-top: 8px;
  padding: 4px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #888;
  background: #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #e0e0e0;
}
</style> 