import type { Rules, TurtleState } from '@/types';

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



const SCREEN_SIZE = 12 // число единиц относительного размера, которое поместится в экран при единичном масштабе

function drawLSystem(state: {
        ctx: CanvasRenderingContext2D, 
        program: string, 
        turtleState: TurtleState, 
        drawOptions: DrawOptions, 
        cameraOptions: CameraOption
    }) {

    const {ctx, program, turtleState, drawOptions, cameraOptions} = state

    let {stepLength, turnAngle, lineWidth, colorMap, defaultColor} = 
    let {x: cameraX, y: cameraY, scale: cameraScale } = cameraOptions;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const characteristicSize = Math.min(width, height) / SCREEN_SIZE;
    const scaledCharSize = characteristicSize * cameraScale;

    // stepLength теперь тоже масштабируется
    const stepLengthPx = stepLength * scaledCharSize;

    // Смещение камеры: x и y минус cameraX, cameraY
    let px = width / 2 + (turtleState.x - cameraX) * scaledCharSize;
    let py = height / 2 - (turtleState.y - cameraY) * scaledCharSize;
    let angle = turtleState.angle

    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const stack: Array<{ px: number, py: number, angle: number }> = [];

    let i = 0;
    while (i < program.length) {
        let ch = program[i];

        // Повороты
        if (ch === '+') {
            angle += turnAngle;
            i++;
            continue;
        }
        if (ch === '-') {
            angle -= turnAngle;
            i++;
            continue;
        }

        // Стек
        if (ch === '[') {
            stack.push({px, py, angle });
            i++;
            continue;
        }
        if (ch === ']') {
            const state = stack.pop();
            if (state) {
                px = state.px;
                py = state.py;
                angle = state.angle;
                ctx.moveTo(px, py);
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
            const len = stepLengthPx * frac;

            if (/[A-ZА-Я]/.test(ch)) { // Большая буква — рисуем
                const color = colorMap[ch] || defaultColor || "black";
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(px, py);
                const rad = angle * Math.PI / 180;
                const newX = px + len * Math.cos(rad);
                const newY = py + len * Math.sin(rad);
                ctx.lineTo(newX, newY);
                ctx.stroke();
                px = newX;
                py = newY;
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
