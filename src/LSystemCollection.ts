
import type { Rules, DrawOptions, LSystemModel } from '@/types';


const LSystemCollection: LSystemModel[] = [
    {
        name: 'Дерево Пифагора',
        axiom: 'Л',
        stepAngle: 45,
        rules: {
            'Л': 'В[+Л]-Л',
            'В': 'ВВ',
        },
        specialDrawOptions: {
            'Л': { color: '#00ff00', lineWidth: 2, step: 1},
            'В': { color: '#2c1d00', lineWidth: 2, step: 1 },
        },
        generalDrawOptions: { color: '#000000', lineWidth: 2, step: 1 },
        start: { x: 0, y: 0, angle: 0 },
        power: 1.3,
        iterations: 3, // Количество итераций
        iterations_max: 8, // Максимальное количество итераций
    },
    // {
    //     name: 'Кривая Госпера',
    //     axiom: 'A',
    //     stepAngle: 60,
    //     rules: {
    //         'A': 'A-B--B+A++AA+B-',
    //         'B': '+A-BB--B-A++A+B',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#2f0272', lineWidth: 2, step: 1 },
    //     start: { x: 300, y: 100, angle: 0 },
    //     power: 1.8,
    // },
    // {
    //     name: 'Кривая дракона',
    //     axiom: 'FA',
    //     stepAngle: 90,
    //     rules: {
    //         'A': 'A+BF+',
    //         'B': '-FA-B',
    //         'F': 'F',
    //     },
    //     drawSettings: {
    //         'A': { color: '#ee2a2a', lineWidth: 2, step: 1 },
    //         'B': { color: '#cc0000', lineWidth: 2, step: 1 },
    //         'F': { color: '#ea0a0a', lineWidth: 2, step: 1 },
    //     },
    //     defaultSetting: { color: '#000000', lineWidth: 2, step: 1 },
    //     start: { x: 0, y: 0, angle: 0 },
    //     power: 2,
    // },
    // {
    //     name: 'Снежинка Коха',
    //     axiom: 'F--F--F',
    //     stepAngle: 60,
    //     rules: {
    //         'F': 'F+F--F+F',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#0ac8ea', lineWidth: 2, step: 1 },
    //     start: { x: 150, y: 50, angle: 0 },
    //     power: 1.3,
    // },
    // {
    //     name: 'Кривая Леви',
    //     axiom: 'F',
    //     stepAngle: 45,
    //     rules: {
    //         'F': '+F--F+',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#3100c2', lineWidth: 2, step: 1 },
    //     start: { x: 150, y: -50, angle: 0 },
    //     power: 1.5,
    // },
    // {
    //     name: 'Треугольник Серпинского',
    //     axiom: 'F-G-G',
    //     stepAngle: 120,
    //     rules: {
    //         'F': 'F-G+F+G-F',
    //         'G': 'GG',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#3100c2', lineWidth: 2, step: 1 },
    //     start: { x: 200, y: 100, angle: 0 },
    //     power: 1.5,
    // },
    // {
    //     name: 'Фрактальная трава',
    //     axiom: 'X',
    //     stepAngle: 25,
    //     rules: {
    //         'X': 'F-[[X]+X]+F[+FX]-X',
    //         'F': 'FF',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#46e100', lineWidth: 2, step: 1 },
    //     start: { x: 0, y: 0, angle: 0 },
    //     power: 2,
    // },
    // {
    //     name: 'Ледяной фрактал',
    //     axiom: 'F+F+F+F',
    //     stepAngle: 90,
    //     rules: {
    //         'F': 'FF+F++F+F',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#3100c2', lineWidth: 2, step: 1 },
    //     start: { x: 150, y: -150, angle: 0 },
    //     power: 1.5,
    // },
    // {
    //     name: 'Мозайка Пенроуза',
    //     axiom: '[B]++[B]++[B]++[B]++[B]',
    //     stepAngle: 36,
    //     rules: {
    //         'A': 'C++D----B[-C----A]++',
    //         'B': '+C--D[---A--B]+',
    //         'C': '-A++B[+++C++D]-',
    //         'D': '--C++++A[+D++++B]--B',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#cc0000', lineWidth: 2, step: 1 },
    //     start: { x: 400, y: 0, angle: 0 },
    //     power: 3,
    // },
    // {
    //     name: 'Кривая Коши',
    //     axiom: 'F',
    //     stepAngle: 80,
    //     rules: {
    //         'F': 'F+F--F+F',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#cc0000', lineWidth: 2, step: 1 },
    //     start: { x: 0, y: 0, angle: 0 },
    //     power: 2,
    // },
    // {
    //     name: 'Кривая Гильберта',
    //     axiom: 'lFl+F+lFl',
    //     stepAngle: 90,
    //     rules: {
    //         'l': '-rF+lFl+Fr-',
    //         'r': '+lF-rFr-Fl+',
    //         'F': 'F',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#cc0000', lineWidth: 2, step: 1 },
    //     start: { x: 0, y: 0, angle: 0 },
    //     power: 2,
    // },
    // {
    //     name: 'Кривая Пеано',
    //     axiom: '++Fa',
    //     stepAngle: 22.5,
    //     rules: {
    //         'a': 'a-ba+ca+ca+ca-ba-ba-ba+ca',
    //         'b': 'F-F-F-F',
    //         'c': 'F+F+F+F',
    //         'F': 'F',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#cc0000', lineWidth: 2, step: 1 },
    //     start: { x: -100, y: -250, angle: 0 },
    //     power: 2,
    // },
    // {
    //     name: 'Крест-квадрат',
    //     axiom: 'A+A+A+A+',
    //     stepAngle: 90,
    //     rules: {
    //         'A': 'A+A-A-A+A',
    //     },
    //     drawSettings: {},
    //     defaultSetting: { color: '#003acc', lineWidth: 2, step: 1 },
    //     start: { x: -100, y: -250, angle: 0 },
    //     power: 2,
    // },
];

export default LSystemCollection;