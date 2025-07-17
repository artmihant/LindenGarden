import type { Rules, Turtle, DrawOptions, Camera, GeneralDrawOptions } from '@/types';
/**
 * Применяет правила L-системы к строке для заданного количества итераций.
 */
function applyRules(axiom: string, rules: Rules): string {
    let next = '';
    for (const ch of axiom) {
        next += rules[ch] ?? ch;
    }
    return next;
}

/**
 * Возвращает новые правила, в которых команды F, +, - получают дробный суффикс.
 * @param rules Обычные правила L-системы
 * @param fracStep Дробная часть шага (например, 0.37)
 */
function partialApplyRules(rules: Rules, fracStep: number): Rules {
    const compStep = 1-fracStep
    const fracSuffix = fracStep.toFixed(2).replace(/^0/, "").replace(/0+$/, "");
    const compSuffix = compStep.toFixed(2).replace(/^0/, "").replace(/0+$/, "");

    const newRules: Rules = {};
    for (const key in rules) {
        let newRule = key+compSuffix;
        for (const ch of rules[key]) {
            if (/^[a-zA-Zа-яА-Я]$/.test(ch)) {
                newRule += ch + fracSuffix;
            } else {
                newRule += ch;
            }
        }
        newRules[key] = newRule;
    }
    return newRules;
}


/**
 * Генерирует строку L-системы для дробного шага.
 * @param axiom Аксиома (начальная строка)
 * @param rules Правила переписывания
 * @param step Дробный шаг (например, 2.37)
 * @returns Строка команд для черепашки с дробными суффиксами
 */
function generateLProgram(axiom: string, rules: Rules, step: number): string {
    if (step < 0) throw new Error('Step must be >= 0');
    if (step == 0) return axiom
    if (step == 1) return applyRules(axiom, rules)
    if (step > 1) return generateLProgram(applyRules(axiom, rules), rules, step-1)
    return generateLProgram(axiom, partialApplyRules(rules, step), 1)
}    

 // функция для перевода из относительных координат в пиксели
function toPixels(turtle: Turtle, camera: Camera): [number, number] {
    return [
        camera.x + turtle.x * camera.scale,
        camera.y + turtle.y * camera.scale
    ]
}

function drawLSystem(state: {
        ctx: CanvasRenderingContext2D, 
        program: string, 
        turtleInitialState: Turtle, 
        stepAngle: number,
        generalDrawOption: DrawOptions,
        specialDrawOptions: {[key: string]: DrawOptions}, 
        camera: Camera
    }) {

    const {ctx, program, turtleInitialState:turtle, stepAngle, specialDrawOptions, generalDrawOption, camera} = state

    ctx.save();
    debugger
    ctx.lineWidth = generalDrawOption.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const stack: Array<Turtle> = [];

    let i = 0;
    while (i < program.length) {
        let ch = program[i];

        // Повороты
        if (ch === '+') {
            turtle.angle += stepAngle;
            i++;
            continue;
        }
        if (ch === '-') {
            turtle.angle -= stepAngle;
            i++;
            continue;
        }

        // Стек
        if (ch === '[') {
            stack.push({x:turtle.x, y:turtle.y, angle:turtle.angle });
            i++;
            continue;
        }
        if (ch === ']') {
            const turtleState = stack.pop();
            if (turtleState) {
                turtle.x = turtleState.x;
                turtle.y = turtleState.y;
                turtle.angle = turtleState.angle;
                ctx.moveTo(...toPixels(turtle, camera));
            }
            i++;
            continue;
        }

        // Проверяем на суффикс .N
        let match = program.slice(i).match(/^([A-Za-zА-Яа-я])((?:\.[0-9]+)*)/);
        if (match) {
            ch = match[1];
            let frac = 1;
            if (match[2]) {
                // Если есть суффикс, например .3 или .75
                const fracStr = match[2];
                if (fracStr) {
                    // Берём только первую дробь после точки
                    const fracMatch = fracStr.match(/\.(\d+)/);
                    if (fracMatch) {
                        frac = parseFloat('0.' + fracMatch[1]);
                    }
                }
            }

            if (/[A-ZА-Я]/.test(ch)) { // Большая буква — рисуем

                if (specialDrawOptions[ch]) {
                    const {color, lineWidth, step} = specialDrawOptions[ch]
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lineWidth;
                    frac *= step
                } else {
                    const {color, lineWidth, step} = specialDrawOptions[ch]
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lineWidth;
                    frac *= step

                }
                ctx.beginPath();
                ctx.moveTo(...toPixels(turtle, camera));
                const rad = turtle.angle * Math.PI / 180;
                turtle.x += frac * Math.cos(rad);
                turtle.y += frac * Math.sin(rad);

                ctx.lineTo(...toPixels(turtle, camera));
                ctx.stroke();
            } // Маленькая буква — ничего не делаем

            i += match[0].length;
            continue;
        }

        // Если не распознано — просто пропускаем
        i++;
    }

    ctx.restore();
}

export { generateLProgram, drawLSystem};
