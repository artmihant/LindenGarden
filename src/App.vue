<template>
    <div style="width:100vw; min-height: 100vh;">
        <!-- <div style="margin-left:320px; padding:20px;">
            {{ figure.rule }}
        </div> -->
        <canvas id="canvas" style="width:100vw; height:100vh;"></canvas>

    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import type { Camera } from '@/types';
import { generateLProgram, drawLSystem } from '@/LSystem.js';

const SCREEN_SIZE = 6;

const camera = reactive<Camera>({
    x: 0,
    y: 0,
    scale: 1
});

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
        ctx,
        program: "F.1+F.2+F.3+F.4+F.5+F.6+F.7+F.8+F.9+F.10",
        turtleInitialState: { x: 0, y: 0, angle: 0 },
        generalDrawOptions: {
            step: 1,         // длина шага
            stepAngle: 120,  // угол поворота
            color: "black",
            lineWidth: 1
        },
        specialDrawOptions: {
            F: { color: "red", lineWidth: 1, step: 1 },
            G: { color: "green", lineWidth: 1, step: 1 }
        },
        camera
    });
}

function resizeCanvasAndCamera() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.x = canvas.width / 2;
    camera.y = canvas.height / 2;
    camera.scale = Math.min(canvas.width, canvas.height) / SCREEN_SIZE;
    render();
}

onMounted(() => {
    resizeCanvasAndCamera();

    window.addEventListener('resize', resizeCanvasAndCamera);

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    // Мышь
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        console.log(camera.x, camera.y, camera.scale);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        camera.x += dx;
        camera.y += dy;
        render();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Колесо мыши (zoom)
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scaleAmount = e.deltaY < 0 ? 1.1 : 0.9;
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        camera.x = cx - (cx - camera.x) * scaleAmount;
        camera.y = cy - (cy - camera.y) * scaleAmount;
        camera.scale *= scaleAmount;
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
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const minSize = Math.min(canvas.width, canvas.height);
        if (e.touches.length === 1 && isDragging) {
            const dx = e.touches[0].clientX - lastMouseX;
            const dy = e.touches[0].clientY - lastMouseY;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
            camera.x += dx ;
            camera.y += dy ;
            render();
        } else if (e.touches.length === 2) {
            // Pinch zoom
            const newDist = getTouchDist(e);
            const scaleAmount = newDist / lastTouchDist;
            lastTouchDist = newDist;
            const newCenter = getTouchCenter(e);
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
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', (e) => {
        isDragging = false;
    });
});
</script>

