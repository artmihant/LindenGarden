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
function partialApplyRules(rules: Rules, fracStep: number, power: number): Rules {

    const compStep = 1-fracStep
    fracStep = (power**fracStep - compStep)/power

    const fracSuffix = fracStep.toFixed(3).replace(/^0/, "").replace(/0+$/, "");
    const compSuffix = compStep.toFixed(3).replace(/^0/, "").replace(/0+$/, "");

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
function generateLProgram(axiom: string, rules: Rules, step: number, power: number): string {
    if (step < 0) throw new Error('Step must be >= 0');
    if (step == 0) return axiom
    if (step == 1) return applyRules(axiom, rules)
    if (step > 1) return generateLProgram(applyRules(axiom, rules), rules, step-1, power)
    return generateLProgram(axiom, partialApplyRules(rules, step, power), 1, power)
}

 // функция для перевода из относительных координат в пиксели
function toPixels(turtle: Turtle, camera: Camera, power: number, iterations: number): [number, number] {
    const powerScale = power**iterations
    return [
        camera.x + turtle.x * camera.scale/powerScale,
        camera.y + turtle.y * camera.scale/powerScale
    ]
}

function drawLSystem(state: {
        ctx: CanvasRenderingContext2D,
        program: string,
        turtleInitialState: Turtle,
        stepAngle: number,
        drawOptions: {[key: string]: DrawOptions},
        power: number,
        iterations: number,
        camera: Camera
    }) {

    const {ctx, program, turtleInitialState, stepAngle, drawOptions, camera, power, iterations} = state

    const turtle = {...turtleInitialState}
    ctx.save();
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const stack: Array<Turtle> = [];

    let i = 0;
    while (i < program.length) {
        let ch = program[i];


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
                ctx.moveTo(...toPixels(turtle, camera, power, iterations));
            }
            i++;
            continue;
        }

        // Проверяем на суффикс .N
        let match = program.slice(i).match(/^([A-Za-zА-Яа-я\+\-])((?:\.[0-9]+)*)/);
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

                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;

                if (drawOptions[ch]) {
                    const {color, lineWidth, step} = drawOptions[ch]
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lineWidth;
                    frac *= step
                }

                ctx.beginPath();
                ctx.moveTo(...toPixels(turtle, camera, power, iterations));
                const rad = turtle.angle * Math.PI / 180;
                turtle.x += frac * Math.cos(rad);
                turtle.y += frac * Math.sin(rad);

                ctx.lineTo(...toPixels(turtle, camera, power, iterations));
                ctx.stroke();
            } // Маленькая буква — ничего не делаем

            // Повороты
            if (ch === '+') {
                turtle.angle += stepAngle*frac;
                i++;
                continue;
            }
            if (ch === '-') {
                turtle.angle -= stepAngle*frac;
                i++;
                continue;
            }


            i += match[0].length;
            continue;
        }

        // Если не распознано — просто пропускаем
        i++;
    }

    ctx.restore();
}

export { generateLProgram, drawLSystem};
