
import type { Rules, DrawOptions, LSystemModel } from '@/types';


const LSystemCollection: LSystemModel[] = [
    {
        name: 'Дерево Пифагора',
        axiom: 'L',
        stepAngle: 45,
        rules: {
            'L': 'B[+L]-L',
            'B': 'BB',
        },
        drawOptions: {
            'L': { color: '#00ff00', lineWidth: 2, step: 1},
            'B': { color: '#2c1d00', lineWidth: 2, step: 1},
        },
        start: { x: 0, y: 0, angle: -90 },
        power:2,
        iterations: 3,
        iterations_max: 10,
    },
    {
        name: 'Кривая Госпера',
        axiom: 'A',
        stepAngle: 60,
        rules: {
            'A': 'A-B--B+A++AA+B-',
            'B': '+A-BB--B-A++A+B',
        },
        drawOptions: {
            'A': { color: '#2f0272', lineWidth: 1, step: 1 },
            'B': { color: '#2f0272', lineWidth: 1, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 3,
        iterations: 3,
        iterations_max: 5,
    },
    {
        name: 'Кривая дракона',
        axiom: 'FA',
        stepAngle: 90,
        rules: {
            'A': 'A+BF+',
            'B': '-FA-B',
            'F': 'F',
        },
        drawOptions: {
            'A': { color: '#ee2a2a', lineWidth: 2, step: 1 },
            'B': { color: '#cc0000', lineWidth: 2, step: 1 },
            'F': { color: '#ea0a0a', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 1.5,
        iterations: 3,
        iterations_max: 12,
    },
    {
        name: 'Снежинка Коха',
        axiom: 'F--F--F',
        stepAngle: 60,
        rules: {
            'F': 'F+F--F+F',
        },
        drawOptions: {
            'F': { color: '#0ac8ea', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 2,
        iterations: 1, // Количество итераций
        iterations_max: 6, // Максимальное количество итераций
    },
    {
        name: 'Кривая Леви',
        axiom: 'F',
        stepAngle: 45,
        rules: {
            'F': '+F--F+',
        },
        drawOptions: {
            'F': { color: '#3100c2', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 1.5,
        iterations: 1,
        iterations_max: 10,
    },
    {
        name: 'Треугольник Серпинского',
        axiom: 'F-G-G',
        stepAngle: 120,
        rules: {
            'F': 'F-G+F+G-F',
            'G': 'GG',
        },
        drawOptions: {
            'F': { color: '#3100c2', lineWidth: 2, step: 1 },
            'G': { color: '#3100c2', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 2,
        iterations: 1,
        iterations_max: 5,
    },
    {
        name: 'Фрактальная трава',
        axiom: 'X',
        stepAngle: 25,
        rules: {
            'X': 'F-[[X]+X]+F[+FX]-X',
            'F': 'FF',
        },
        drawOptions: {
            'X': { color: '#46e100', lineWidth: 2, step: 1 },
            'F': { color: '#46e100', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: -90 },
        power: 2,
        iterations: 1,
        iterations_max: 5,
    },
    {
        name: 'Ледяной фрактал',
        axiom: 'F+F+F+F',
        stepAngle: 90,
        rules: {
            'F': 'FF+F++F+F',
        },
        drawOptions: {
            'F': { color: '#3100c2', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 3,
        iterations: 1,
        iterations_max: 5,
    },
    {
        name: 'Мозайка Пенроуза',
        axiom: '[B]++[B]++[B]++[B]++[B]',
        stepAngle: 36,
        rules: {
            'A': 'C++D----B[-C----A]++',
            'B': '+C--D[---A--B]+',
            'C': '-A++B[+++C++D]-',
            'D': '--C++++A[+D++++B]--B',
        },
        drawOptions: {
            'A': { color: '#cc0000', lineWidth: 2, step: 1 },
            'B': { color: '#cc0000', lineWidth: 2, step: 1 },
            'C': { color: '#cc0000', lineWidth: 2, step: 1 },
            'D': { color: '#cc0000', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 1.5,
        iterations: 1,
        iterations_max: 6,
    },
    {
        name: 'Кривая Коши',
        axiom: 'F',
        stepAngle: 80,
        rules: {
            'F': 'F+F--F+F',
        },
        drawOptions: {
            'F': { color: '#cc0000', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 2,
        iterations: 1,
        iterations_max: 5,
    },
    {
        name: 'Кривая Гильберта',
        axiom: 'lFl+F+lFl',
        stepAngle: 90,
        rules: {
            'l': '-rF+lFl+Fr-',
            'r': '+lF-rFr-Fl+',
            'F': 'F',
        },
        drawOptions: {
            'F': { color: '#cc0000', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 2,
        iterations: 1,
        iterations_max: 5,
    },
    {
        name: 'Кривая Пеано',
        axiom: '++Fa',
        stepAngle: 22.5,
        rules: {
            'a': 'a-ba+ca+ca+ca-ba-ba-ba+ca',
            'b': 'F-F-F-F',
            'c': 'F+F+F+F',
            'F': 'F',
        },
        drawOptions: {
            'F': { color: '#cc0000', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 2,
        iterations: 1,
        iterations_max: 4,
    },
    {
        name: 'Крест-квадрат',
        axiom: 'A+A+A+A+',
        stepAngle: 90,
        rules: {
            'A': 'A+A-A-A+A',
        },
        drawOptions: {
            'A': { color: '#003acc', lineWidth: 2, step: 1 },
        },
        start: { x: 0, y: 0, angle: 0 },
        power: 2,
        iterations: 1,
        iterations_max: 5,
    },
];

export default LSystemCollection;
