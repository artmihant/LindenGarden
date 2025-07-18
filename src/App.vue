<template>
    <div class="fixed inset-0 w-full h-full bg-gray-100">
        <!-- Canvas на весь экран -->
        <canvas id="canvas" class="absolute w-full h-full"></canvas>

        <!-- Floating панель поверх canvas -->
        <LSystemForm
            :model="model"
            :figureCollection="figureCollection"
            v-model:chosen="chosen"
            @update:model="onModelUpdate"
            class="absolute top-4 left-4 z-10"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'; // Импорт хуков Vue
import type { Camera, LSystemModel} from '@/types';
import { generateLProgram, drawLSystem } from '@/LSystem'; // Импорт функций генерации и отрисовки L-системы
import LSystemForm from '@/LSystemForm.vue'; // Импорт компонента формы
import LSystemCollection from '@/LSystemCollection'; // Импорт коллекции L-систем

const SCREEN_SIZE = 3; // Размер экрана в условных единицах

const camera = reactive<Camera>({ // Реактивный объект камеры
    x: 0, // Координата X центра камеры
    y: 0, // Координата Y центра камеры
    scale: 1 // Масштаб камеры
});

const figureCollection = LSystemCollection; // Коллекция фигур
const chosen = ref(0); // Индекс выбранной фигуры

const model = ref<LSystemModel>({ ...figureCollection[chosen.value] });

watch(chosen, (val: number) => {
    model.value = { ...figureCollection[val] };
    render();
});

function onModelUpdate(newModel: any) { // Обработка обновления модели
    model.value = { ...newModel }; // Обновляем модель
    render(); // Перерисовываем
}

let isDragging = false; // Флаг перетаскивания мышью
let lastMouseX = 0; // Последняя позиция мыши X
let lastMouseY = 0; // Последняя позиция мыши Y
let lastTouchDist = 0; // Последнее расстояние между двумя пальцами
let lastTouchCenter = { x: 0, y: 0 }; // Последний центр между двумя пальцами

function getTouchDist(e: TouchEvent) { // Получить расстояние между двумя пальцами
    if (e.touches.length < 2) return 0; // Если пальцев меньше двух — 0
    const dx = e.touches[0].clientX - e.touches[1].clientX; // Разница по X
    const dy = e.touches[0].clientY - e.touches[1].clientY; // Разница по Y

    return Math.sqrt(dx * dx + dy * dy); // Евклидово расстояние
}

function getTouchCenter(e: TouchEvent) { // Получить центр между двумя пальцами
    if (e.touches.length < 2) return { x: 0, y: 0 }; // Если пальцев меньше двух — центр (0,0)

    return {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2, // Среднее по X
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2  // Среднее по Y
    };
}

function render() { // Функция отрисовки L-системы
    const canvas = document.getElementById('canvas') as HTMLCanvasElement; // Получаем канвас
    const ctx = canvas.getContext('2d')!; // Получаем контекст рисования
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас

    const program = generateLProgram(
        model.value.axiom,
        model.value.rules,
        Number(model.value.iterations),
        Number(model.value.power)
    )

    drawLSystem({ // Вызываем функцию отрисовки L-системы
        ctx,
        program,
        turtleInitialState: model.value.start, // Начальное состояние "черепахи"
        stepAngle: model.value.stepAngle,  // угол поворота
        specialDrawOptions: model.value.specialDrawOptions,
        power: model.value.power,
        iterations: model.value.iterations,
        camera, // Параметры камеры,
    });
}

function resizeCanvasAndCamera() { // Изменение размера канваса и камеры
    const canvas = document.getElementById('canvas') as HTMLCanvasElement; // Получаем канвас

    // Принудительно устанавливаем размеры
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    camera.x = canvas.width / 2; // Центр камеры по X
    camera.y = canvas.height / 2; // Центр камеры по Y
    camera.scale = Math.min(canvas.width, canvas.height) / SCREEN_SIZE; // Масштаб камеры
    render(); // Перерисовываем
}

onMounted(() => { // Хук, вызываемый при монтировании компонента
    // Принудительно обновляем размеры несколько раз
    setTimeout(() => resizeCanvasAndCamera(), 0);
    setTimeout(() => resizeCanvasAndCamera(), 100);
    setTimeout(() => resizeCanvasAndCamera(), 500);

    window.addEventListener('resize', () => { // При изменении размера окна
        resizeCanvasAndCamera(); // Пересчитываем размеры
    });

    const canvas = document.getElementById('canvas') as HTMLCanvasElement; // Получаем канвас

    // Мышь
    canvas.addEventListener('mousedown', (e) => { // Нажатие мыши
        isDragging = true; // Включаем перетаскивание
        const rect = canvas.getBoundingClientRect(); // Получаем границы канваса
        lastMouseX = e.clientX - rect.left; // Сохраняем позицию X
        lastMouseY = e.clientY - rect.top; // Сохраняем позицию Y
    });

    canvas.addEventListener('mousemove', (e) => { // Движение мыши
        if (!isDragging) return; // Если не перетаскиваем — выходим
        const rect = canvas.getBoundingClientRect(); // Границы канваса
        const x = e.clientX - rect.left; // Текущий X
        const y = e.clientY - rect.top; // Текущий Y
        const dx = x - lastMouseX; // Смещение по X
        const dy = y - lastMouseY; // Смещение по Y
        lastMouseX = x; // Обновляем X
        lastMouseY = y; // Обновляем Y
        camera.x += dx; // Сдвигаем камеру по X
        camera.y += dy; // Сдвигаем камеру по Y
        render(); // Перерисовываем
    });
    canvas.addEventListener('mouseup', () => { // Отпускание мыши
        isDragging = false; // Отключаем перетаскивание
    });
    canvas.addEventListener('mouseleave', () => { // Уход мыши с канваса
        isDragging = false; // Отключаем перетаскивание
    });

    // Колесо мыши (zoom)
    canvas.addEventListener('wheel', (e) => { // Прокрутка колеса мыши
        e.preventDefault(); // Предотвращаем стандартное поведение
        const scaleAmount = e.deltaY < 0 ? 1.1 : 0.9; // Определяем масштаб (увеличение/уменьшение)
        const rect = canvas.getBoundingClientRect(); // Boundaries канваса
        const cx = e.clientX - rect.left; // Координата X курсора
        const cy = e.clientY - rect.top; // Координата Y курсора
        camera.x = cx - (cx - camera.x) * scaleAmount; // Центрируем масштаб относительно курсора
        camera.y = cy - (cy - camera.y) * scaleAmount;
        camera.scale *= scaleAmount; // Применяем масштаб
        render(); // Перерисовываем
    }, { passive: false });

    // Touch
    canvas.addEventListener('touchstart', (e) => { // Начало касания
        if (e.touches.length === 1) { // Одно касание — перетаскивание
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        } else if (e.touches.length === 2) { // Два касания — pinch zoom
            lastTouchDist = getTouchDist(e);
            lastTouchCenter = getTouchCenter(e);
        }
    });
    canvas.addEventListener('touchmove', (e) => { // Движение пальцев
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const minSize = Math.min(canvas.width, canvas.height);
        if (e.touches.length === 1 && isDragging) { // Перетаскивание одним пальцем
            const dx = e.touches[0].clientX - lastMouseX;
            const dy = e.touches[0].clientY - lastMouseY;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
            camera.x += dx ;
            camera.y += dy ;
            render();
        } else if (e.touches.length === 2) { // Два пальца — pinch zoom
            // Pinch zoom
            const newDist = getTouchDist(e); // Новое расстояние между пальцами
            const scaleAmount = newDist / lastTouchDist; // Во сколько раз изменился масштаб
            lastTouchDist = newDist; // Обновляем расстояние
            const newCenter = getTouchCenter(e); // Новый центр между пальцами
            const rect = canvas.getBoundingClientRect();
            const cx = newCenter.x - rect.left;
            const cy = newCenter.y - rect.top;
            const worldX = (cx - canvas.width / 2) + camera.x;
            const worldY = -(cy - canvas.height / 2) + camera.y;
            camera.x = worldX - (worldX - camera.x) * scaleAmount;
            camera.y = worldY - (worldY - camera.y) * scaleAmount;
            camera.scale *= scaleAmount;
            render();
        }
        e.preventDefault(); // Предотвращаем стандартное поведение
    }, { passive: false });
    window.addEventListener('touchend', (e) => { // Окончание касания
        isDragging = false; // Отключаем перетаскивание
    });
});
</script>

