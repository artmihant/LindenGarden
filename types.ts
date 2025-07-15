interface Rules {
    [key: string]: string;
}

interface drawSetting { 
    color?: string,
    lineWidth?: number,
    stepLength?: number,
}

// Состояние черепашки
interface TurtleState {
    x: number; // позиция x в относительных единицах
    y: number; // позиция y в относительных единицах
    angle: number; // угол поворота
}

interface DrawOptions { 
    color: string, // Цвет линии 
    lineWidth: number, // Толщина линии
    step: number, // длина шага в относительных единицах
}

interface LSystemRule {
    replace: string;      // Правило замены для символа
    color?: string;        // Цвет линии для этого символа
    lineWidth?: number;    // Толщина линии для этого символа
}


interface CameraOption {
    x: number; // смещение камеры по X (в относительных единицах)
    y: number; // смещение камеры по Y (в относительных единицах)
    scale: number; // масштаб камеры (1 = стандартный)
}