export interface Rules {
    [key: string]: string;
}


// Состояние черепашки
export interface Turtle {
    x: number; // позиция x в относительных единицах
    y: number; // позиция y в относительных единицах
    angle: number; // угол поворота
}

export interface DrawOptions { 
    color: string, // Цвет линии 
    lineWidth: number, // Толщина линии
    step: number, // длина шага в относительных единицах
}

export interface GeneralDrawOptions extends DrawOptions {
    stepAngle: number,
}

export interface LSystemRule {
    replace: string;      // Правило замены для символа
    color?: string;        // Цвет линии для этого символа
    lineWidth?: number;    // Толщина линии для этого символа
}


export interface Camera {
    x: number; // смещение камеры по X (в относительных единицах)
    y: number; // смещение камеры по Y (в относительных единицах)
    scale: number; // масштаб камеры (1 = стандартный)
}