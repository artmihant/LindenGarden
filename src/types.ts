export interface Rules {
    [key: string]: string;
}

export interface LSystemModel {
    name: string;                 // Название фигуры
    axiom: string;                // Аксиома (начальная строка)
    stepAngle: number;            // Угол поворота черепашки (в градусах)
    rules: Rules; // Правила переписывания для каждого символа
    specialDrawOptions: {[key: string]: DrawOptions}; // Индивидуальные правила рисования правил с заглавными буквами
    generalDrawOptions: DrawOptions; // Параметры рисования всех правил с заглавными буквами по умолчанию
    start: {x: number, y: number, angle: number}; // Начальное состояние черепашки
    power: number;                // Скорость отдаления камеры в процессе роста
    iterations: number; // Количество итераций
    iterations_max: number // Максимальное количество итераций
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
