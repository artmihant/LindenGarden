<template>
    <div style="width:100vw; min-height: 100vh;">
        <!-- <div style="margin-left:320px; padding:20px;">
            {{ figure.rule }}
        </div> -->
        <canvas id="canvas" width="800" height="600" style="width:100vw; min-height: 100vh;"></canvas>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import {generateLProgram, drawLSystem} from '@/LSystem.js';

const cameraX = ref(0);
const cameraY = ref(0);
const cameraScale = ref(1);

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

let lastTouchDist = 0;
let lastTouchCenter = { x: 0, y: 0 };

function getTouchDist(e: TouchEvent) {
    if (e.touches.length < 2) return 0;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
function getTouchCenter(e: TouchEvent) {
    if (e.touches.length < 2) return { x: 0, y: 0 };
    return {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
    };
}

function render() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLSystem({
        ctx: ctx,
        program: "F.1+G.2+F.3+G.4+F.5+G.6+F.7+G.8+F.9+G", 
        turtleState: {x: 0, y:0, angle: 0},
        drawSettings: {
            stepLength: 2,
            turnAngle: 120,
            scale: 1,
        },
        drawProgramSettings: {
            F: {color:"red",lineWidth:2}, 
            G: {color:"green",lineWidth:1}
        },
        cameraSettings: {
            x: cameraX.value,
            y: cameraY.value,
            scale: cameraScale.value
        }
    });
}

onMounted(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    render();

    // Мышь
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        // Переводим пиксели в относительные единицы
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const minSize = Math.min(canvas.width, canvas.height);
        cameraX.value -= dx / (minSize / 12) / cameraScale.value;
        cameraY.value += dy / (minSize / 12) / cameraScale.value;
        render();
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Колесо мыши (zoom)
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scaleAmount = e.deltaY < 0 ? 1.1 : 0.9;
        // Центрируем zoom относительно курсора
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const minSize = Math.min(canvas.width, canvas.height);
        const worldX = (cx - canvas.width / 2) / (minSize / 12) / cameraScale.value + cameraX.value;
        const worldY = -(cy - canvas.height / 2) / (minSize / 12) / cameraScale.value + cameraY.value;
        cameraX.value = worldX - (worldX - cameraX.value) * scaleAmount;
        cameraY.value = worldY - (worldY - cameraY.value) * scaleAmount;
        cameraScale.value *= scaleAmount;
        render();
    }, { passive: false });

    // Touch
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            lastTouchDist = getTouchDist(e);
            lastTouchCenter = getTouchCenter(e);
        }
    });
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            const dx = e.touches[0].clientX - lastMouseX;
            const dy = e.touches[0].clientY - lastMouseY;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const minSize = Math.min(canvas.width, canvas.height);
            cameraX.value -= dx / (minSize / 12) / cameraScale.value;
            cameraY.value += dy / (minSize / 12) / cameraScale.value;
            render();
        } else if (e.touches.length === 2) {
            // Pinch zoom
            const newDist = getTouchDist(e);
            const scaleAmount = newDist / lastTouchDist;
            lastTouchDist = newDist;
            // Центр pinch
            const newCenter = getTouchCenter(e);
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const minSize = Math.min(canvas.width, canvas.height);
            const cx = newCenter.x - canvas.getBoundingClientRect().left;
            const cy = newCenter.y - canvas.getBoundingClientRect().top;
            const worldX = (cx - canvas.width / 2) / (minSize / 12) / cameraScale.value + cameraX.value;
            const worldY = -(cy - canvas.height / 2) / (minSize / 12) / cameraScale.value + cameraY.value;
            cameraX.value = worldX - (worldX - cameraX.value) * scaleAmount;
            cameraY.value = worldY - (worldY - cameraY.value) * scaleAmount;
            cameraScale.value *= scaleAmount;
            render();
        }
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', (e) => {
        isDragging = false;
    });
});
</script>

