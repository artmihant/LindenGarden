<template>
    <div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out flex flex-col"
         :class="isCollapsed ? 'w-12 h-12' : 'w-80 h-screen'">

        <!-- Заголовок с кнопкой сворачивания -->
        <div class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h2 v-if="!isCollapsed" class="text-lg font-semibold text-gray-800">L-System</h2>
            <button @click="toggleCollapse"
                    class="p-1 rounded hover:bg-gray-200 transition-colors"
                    :title="isCollapsed ? 'Развернуть панель' : 'Свернуть панель'">
                <svg class="w-5 h-5 text-gray-600 transition-transform duration-300"
                     :class="isCollapsed ? 'rotate-180' : ''"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>

        <!-- Ползунок итераций для свернутого состояния -->
        <div v-if="isCollapsed" class="p-3">
            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="text-sm font-medium text-gray-700">Итерация</label>
                    <span class="text-sm text-gray-500">{{model.iterations}}</span>
                </div>
                <input type="range" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                       min="0" :max="model.iterations_max" step="0.1" v-model="model.iterations" @input="emitUpdate">
            </div>
        </div>

        <!-- Полный контент панели -->
        <div v-if="!isCollapsed" class="flex-1 overflow-y-auto">
            <!-- Выбор L-системы -->
            <div class="p-3 border-b border-gray-200 bg-gray-50">
                <select :value="chosen" @change="onPresetChange"
                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option :key='i' v-for="(f,i) in figureCollection" :value="i">{{f.name}}</option>
                </select>
            </div>

            <!-- Основные настройки -->
            <div class="p-3 space-y-3">
                <!-- Итерация -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-medium text-gray-700">Итерация</label>
                        <span class="text-sm text-gray-500">{{model.iterations}}</span>
                    </div>
                    <input type="range" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                           min="0" :max="model.iterations_max" step="0.1" v-model="model.iterations" @input="emitUpdate">
                </div>

                <!-- Угол -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-medium text-gray-700">Угол</label>
                        <span class="text-sm text-gray-500">{{model.stepAngle}}°</span>
                    </div>
                    <input type="range" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                           min="0" max="180" step="1" v-model="model.stepAngle" @input="emitUpdate">
                </div>

                <!-- Аксиома -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Начало</label>
                    <input v-model="model.axiom" @input="emitUpdate"
                           class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Правила -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-medium text-gray-700">Правила</label>
                        <button @click="addRule"
                                class="px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm font-medium rounded transition-colors">
                            + Добавить
                        </button>
                    </div>
                    <div class="space-y-2">
                        <div v-for="key in Object.keys(model.rules)" :key="key"
                             class="bg-gray-50 border border-gray-200 rounded p-2">
                            <div class="flex items-center justify-between mb-2">
                                                                <input v-model="symbolInputs[key]"
                                       @change="onSymbolChange(key, symbolInputs[key])"
                                       @keypress="onSymbolKeypress"
                                       class="w-8 h-8 text-center font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                       maxlength="1"/>
                                <button @click="removeRule(key)"
                                        class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full transition-colors">
                                    ×
                                </button>
                            </div>
                            <textarea v-model="model.rules[key]" @input="emitUpdate"
                                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
                                      rows="1" placeholder="Правило"></textarea>
                                                        <!-- Настройки отображения только для заглавных букв (которые рисуют) -->
                            <div v-if="isDrawingSymbol(key)" class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <label class="text-xs text-gray-600 w-12">Цвет:</label>
                                    <input type="color" v-model="model.drawOptions[key].color" @input="emitUpdate"
                                           class="w-6 h-6 rounded cursor-pointer border border-gray-300">
                                </div>
                                <div class="flex items-center gap-2">
                                    <label class="text-xs text-gray-600 w-12">Толщина:</label>
                                    <input type="number" v-model="model.drawOptions[key].lineWidth" @input="emitUpdate"
                                           class="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                           min="1" max="10">
                                    <label class="text-xs text-gray-600 w-12">Длина:</label>
                                    <input type="number" v-model="model.drawOptions[key].step" @input="emitUpdate"
                                           class="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                           min="0.1" max="5" step="0.1">
                                </div>
                            </div>
                            <!-- Пояснение для строчных букв -->
                            <div v-else class="text-xs text-gray-500 italic">
                                Строчные буквы не отрисовываются (только перемещение)
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Степень роста -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Степень роста</label>
                    <div class="flex items-center gap-2">
                        <input v-model="model.power" @input="emitUpdate"
                               class="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <span class="text-sm text-gray-500">^ {{model.iterations}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Свернутое состояние -->
        <div v-else class="flex-1 flex items-center justify-center">
            <div class="text-gray-400 text-xs transform -rotate-90 whitespace-nowrap">
                L-System
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {watch, toRefs, reactive, nextTick, ref} from 'vue';
import type { LSystemModel } from '@/types';

const props = defineProps<{
    model: LSystemModel,
    figureCollection: LSystemModel[],
    chosen: number
}>();
const emit = defineEmits(['update:model', 'update:chosen', 'preset-change']);

const { model, figureCollection } = toRefs(props);
const symbolInputs = reactive<Record<string, string>>({});
const isCollapsed = ref(false);

// Инициализация symbolInputs при изменении модели
watch(model, (newModel) => {
    Object.keys(newModel.rules).forEach(key => {
        symbolInputs[key] = key;
    });
}, { immediate: true });

function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
}

function emitUpdate() {
    emit('update:model', model.value);
}

function onPresetChange(event: Event) {
    const val = Number((event.target as HTMLSelectElement).value);
    emit('update:chosen', val);
}

function addRule() {
    // Найти первую свободную английскую букву (A-Z)
    for (let code = 'A'.charCodeAt(0); code <= 'Z'.charCodeAt(0); code++) {
        const letter = String.fromCharCode(code);
        if (!model.value.rules[letter]) {
            model.value.rules[letter] = '';
            model.value.drawOptions[letter] = {
                color: '#000000',
                lineWidth: 1,
                step: 1
            };
            symbolInputs[letter] = letter;
            emitUpdate();
            return;
        }
    }
    // Если все буквы A-Z заняты, ничего не добавляем
    nextTick(() => {
        const inputs = document.querySelectorAll('input[maxlength="1"]');
        if (inputs.length) (inputs[inputs.length-1] as HTMLInputElement).focus();
    });
}

function removeRule(key: string) {
    delete model.value.rules[key];
    delete model.value.drawOptions[key];
    delete symbolInputs[key];
    emitUpdate();
}

function onSymbolChange(oldKey: string, newKey: string) {
    newKey = newKey.trim().toUpperCase();

    // Проверяем, что это английская буква
    if (!newKey || !/^[A-Z]$/.test(newKey)) {
        symbolInputs[oldKey] = oldKey;
        return;
    }

    if (oldKey === newKey || model.value.rules[newKey]) {
        symbolInputs[oldKey] = oldKey;
        return;
    }

    model.value.rules[newKey] = model.value.rules[oldKey];
    model.value.drawOptions[newKey] = model.value.drawOptions[oldKey];
    symbolInputs[newKey] = newKey;
    removeRule(oldKey);
    emitUpdate();
}

function isDrawingSymbol(key: string): boolean {
    // Проверяем, является ли символ заглавной английской буквой (рисующей)
    return /^[A-Z]$/.test(key);
}

function onSymbolKeypress(event: KeyboardEvent) {
    // Разрешаем только английские буквы
    const char = event.key.toUpperCase();
    if (!/^[A-Z]$/.test(char)) {
        event.preventDefault();
    }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>
