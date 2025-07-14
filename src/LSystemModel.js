// Класс, описывающий модель L-системы (без визуализации)
class LSystemModel {
    /**
     * Конструктор: инициализация модели L-системы
     * @param {Object} options - параметры L-системы
     */
    constructor(options = {}) {
        this.update(options);
    }

    /**
     * Обновляет параметры L-системы
     * @param {Object} options - новые параметры
     */
    update(options = {}) {
        this.saveable = options.saveable || false; // Можно ли сохранять в localStorage
        this.name = options.name || '';            // Имя пресета/системы
        this.angle = options.angle || 30;          // Угол поворота (градусы)
        this.axiom = options.axiom || '';          // Начальное слово (аксиома)
        this.rules = options.rules || {};          // Правила переписывания
        this.iterations = options.iterations || Math.floor((options.iterations_max || 10) / 2) || 0; // Текущее число итераций
        this.iterations_max = options.iterations_max || 10; // Максимальное число итераций
        this.diameter = options.diameter || 300;   // Диаметр/размер фигуры (для визуализации)
        this.start = options.start || [0, 0];      // Начальная позиция (для визуализации)
        this.power = options.power || 1;           // Степень для масштабирования
        this.dir = options.dir || [1, 0];          // Начальное направление (для визуализации)
    }

    /**
     * Сохраняет параметры L-системы в localStorage (если разрешено)
     */
    save() {
        let { name, angle, axiom, rules, saveable, iterations, diameter, power } = this;
        if (saveable)
            localStorage.setItem('figure', JSON.stringify({ name, angle, axiom, rules, saveable, iterations, diameter, power }));
    }

    /**
     * Генерирует строку L-системы после заданного числа итераций
     */
    get rule() {
        let rule = this.axiom;
        for (let i = 0; i < this.iterations; i++) {
            let new_rule = '';
            for (let j = 0; j < rule.length; j++) {
                let ch = rule.charAt(j);
                if (ch in this.rules) {
                    new_rule += this.rules[ch].replace;
                } else {
                    new_rule += ch;
                }
            }
            rule = new_rule;
        }
        return rule;
    }

    /**
     * Подсчитывает количество элементов (символов), которые будут отрисованы (draw=true)
     */
    get elements_count() {
        let c = 0;
        let rule = this.rule;
        for (let j = 0; j < rule.length; j++) {
            let ch = rule.charAt(j);
            if (ch in this.rules && this.rules[ch].draw) {
                c++;
            }
        }
        return c;
    }
}
