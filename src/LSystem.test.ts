import { describe, it, expect } from '@jest/globals';
import { generateLProgram } from '@/LSystem';

describe('generateLProgram', () => {
    it('возвращает аксиому для шага 0', () => {
        const axiom = 'F';
        const rules = { 'F': 'F+G', 'G': 'F-G' };
        expect(generateLProgram(axiom, rules, 0)).toBe('F');
    });

    it('генерирует строку для целого шага', () => {
        const axiom = 'F';
        const rules = { 'F': 'F+G', 'G': 'F-G' };
        expect(generateLProgram(axiom, rules, 1)).toBe('F+G');
    });

    it('генерирует строку с дробными командами для дробного шага', () => {
        const axiom = 'F';
        const rules = { 'F': 'F+G', 'G': 'F-G' };
        // Для шага 1.5: strFull = F+G, strNext = F+G-F-G
        // expansions: [F+G, F-G]
        // parts: ['F+G', '-F-G']
        // Ожидаем дробные суффиксы
        expect(generateLProgram(axiom, rules, 0.2)).toBe('F.8F.2+.2G.2');
        expect(generateLProgram(axiom, rules, 1.2)).toBe('F.8F.2+.2G.2+G.8F.2-.2G.2');

    });

    it('работает с несколькими итерациями', () => {
        const axiom = 'F';
        const rules = { 'F': 'F+F', }; // Двойная линия
        expect(generateLProgram(axiom, rules, 2)).toBe('F+F+F+F');
    });

    it('выбрасывает ошибку при отрицательном шаге', () => {
        const axiom = 'F';
        const rules = { 'F': 'F+G', 'G': 'F-G' };
        expect(() => generateLProgram(axiom, rules, -1)).toThrow();
    });

    it('корректно работает с пустой аксиомой', () => {
        const axiom = '';
        const rules = { 'F': 'F+G', 'G': 'F-G' };
        expect(generateLProgram(axiom, rules, 1)).toBe('');
    });

    it('корректно работает с отсутствием правил', () => {
        const axiom = 'F+G';
        const rules = {};
        expect(generateLProgram(axiom, rules, 1)).toBe('F+G');
    });
}); 