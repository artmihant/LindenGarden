interface Rules {
    [key: string]: string;
}

/**
 * Применяет правила L-системы к строке для заданного количества итераций.
 */
function applyRules(axiom: string, rules: Rules, iterations: number): string {
    let current = axiom;
    for (let i = 0; i < iterations; i++) {
        let next = '';
        for (const ch of current) {
            next += rules[ch] ?? ch;
        }
        current = next;
    }
    return current;
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

    const fullStep = Math.floor(step);
    const fracStep = step - fullStep;

    // Получаем строки для целого и следующего шага
    const strFull = applyRules(axiom, rules, fullStep);
    const strNext = applyRules(axiom, rules, fullStep + 1);

    if (fracStep === 0) return strFull;

    // Для каждой буквы из strFull узнаём её расширение в strNext
    let expansions: string[] = [];
    for (const ch of strFull) {
        expansions.push(rules[ch] ?? ch);
    }

    // Разбиваем strNext на части, соответствующие расширениям
    let parts: string[] = [];
    let pos = 0;
    for (const exp of expansions) {
        parts.push(strNext.slice(pos, pos + exp.length));
        pos += exp.length;
    }

    // Добавляем дробные суффиксы к командам F, +, -
    function addFractionalSuffix(segment: string, fraction: number): string {
        const tokens = segment.match(/\[|\]|F|\+|\-|[^\[\]F\+\-]+/g) || [];
        return tokens
            .map(token => {
                if (token === 'F' || token === '+' || token === '-') {
                    return token + '.' + Number(fraction.toFixed(3)).toString().replace(/0+$/, '').replace(/\.$/, '');
                }
                return token;
            })
            .join('');
    }

    let result = '';
    for (const part of parts) {
        result += addFractionalSuffix(part, fracStep);
    }

    return result;
}

export { generateLProgram };
