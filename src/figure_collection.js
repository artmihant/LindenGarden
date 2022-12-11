export const figure_collection = [
    {
        name: 'Ваша фигура',
        angle: 0,
        axiom: '',
        rules: {},
        saveable: true,
        dir: [0,-1],
    },
    {
        name: 'Дерево Пифагора',
        angle: 45,
        axiom: 'Л',
        rules: {
            'Л': {replace: 'В[+Л]-Л', color: '#00ff00', draw:true},
            'В': {replace: 'ВВ', color: '#2c1d00', draw:true},
        },
        diameter: 300,
        power: 1.3,
        iterations_max: 7,
        dir: [0,-1],
    },
    {
        name: 'Кривая Госпера',
        angle: 60,
        axiom: 'A',
        rules: {
            'A': {replace: 'A-B--B+A++AA+B-', color: '#2f0272', draw:true},
            'B': {replace: '+A-BB--B-A++A+B', color: '#2f0272', draw:true},
        },
        iterations_max: 4,
        diameter: 700,
        start: [300,100],
        power: 1.8
    },
    {
        name: 'Кривая дракона',
        angle: 90,
        axiom: 'FA',
        rules: {
            'A': {replace: 'A+BF+', color: '#ee2a2a', draw:true},
            'B': {replace: '-FA-B', color: '#cc0000', draw:true},
            'F': {replace: 'F', color: '#ea0a0a', draw:true},
        },
        iterations_max: 12,
        diameter: 300,
        start: [0,0],
        power: 2
    },
    {
        name: 'Снежинка Коха',
        angle: 60,
        axiom: 'F--F--F',
        rules: {
            'F': {replace: 'F+F--F+F', color: '#0ac8ea', draw:true},
        },
        iterations_max: 5,
        diameter: 500,
        start: [150,50],
        power: 1.3
    },
    {
        name: 'Кривая Леви',
        angle: 45,
        axiom: 'F',
        rules: {
            'F': {replace: '+F--F+', color: '#3100c2', draw:true},
        },
        iterations_max: 8,
        diameter: 500,
        start: [150,-50],
        power: 1.5
    },
    {
        name: 'Треугольник Серпинского',
        angle: 120,
        axiom: 'F-G-G',
        rules: {
            'F': {replace: 'F-G+F+G-F', color: '#3100c2', draw:true},
            'G': {replace: 'GG', color: '#3100c2', draw:true},
        },
        iterations_max: 8,
        diameter: 700,
        start: [200,100],
        power: 1.5
    },
    {
        name: 'Фрактальная трава',
        angle: 25,
        axiom: 'X',
        rules: {
            'X': {replace: 'F-[[X]+X]+F[+FX]-X', color: '#3100c2', draw:true},
            'F': {replace: 'FF', color: '#46e100', draw:true},
        },
        iterations_max: 8,
        diameter: 200,
        start: [0,0],
        power: 2,
        dir: [0,-1],
    },
    {
        name: 'Ледяной фрактал',
        angle: 90,
        axiom: 'F+F+F+F',
        rules: {
            'F': {replace: 'FF+F++F+F', color: '#3100c2', draw:true},
        },
        iterations_max: 4,
        diameter: 500,
        start: [150,-150],
        power: 1.5
    },
    {
        name: 'Мозайка Пенроуза',
        angle: 36,
        axiom: '[7]++[7]++[7]++[7]++[7]',
        rules: {
            '6': {replace: '8++9----7[-8----6]++', color: '#cc0000', draw:true},
            '7': {replace: '+8--9[---6--7]+', color: '#cc0000', draw:true},
            '8': {replace: '-6++7[+++8++9]-', color: '#cc0000', draw:true},
            '9': {replace: '--8++++6[+9++++7]--7', color: '#cc0000', draw:true},
        },
        iterations_max: 5,
        diameter: 700,
        start: [400,0],
        power: 3
    },
    {
        name: 'Кривая Коши',
        angle: 80,
        axiom: 'F',
        rules: {
            'F': {replace: 'F+F--F+F', color: '#cc0000', draw:true},
        },
        iterations_max: 10,
        diameter: 400,
        start: [0,0],
        power: 2
    },
    {
        name: 'Кривая Гильберта',
        angle: 90,
        axiom: 'LFL+F+LFL',
        rules: {
            'L': {replace: '-RF+LFL+FR-', color: '#cc0000', draw:false},
            'R': {replace: '+LF-RFR-FL+', color: '#cc0000', draw:false},
            'F': {replace: 'F', color: '#cc0000', draw:true},
        },
        iterations_max: 5,
        diameter: 400,
        start: [0,0],
        power: 2
    },
    {
        name: 'Кривая Пеано',
        angle: 22.5,
        axiom: '++FA',
        rules: {
            'A': {replace: 'A-BA+CA+CA+CA-BA-BA-BA+CA', color: '#cc0000', draw:false},
            'B': {replace: 'F-F-F-F', color: '#cc0000', draw:false},
            'C': {replace: 'F+F+F+F', color: '#cc0000', draw:false},
            'F': {replace: 'F', color: '#cc0000', draw:true},
        },
        iterations_max: 4,
        diameter: 300,
        start: [-100,-250],
        power: 2
    },
    {
        name: 'Крест-квадрат',
        angle: 90,
        axiom: 'A+A+A+A+',
        rules: {
            'A': {replace: 'A+A-A-A+A', color: '#003acc', draw:true},
        },
        iterations_max: 4,
        diameter: 300,
        start: [-100,-250],
        power: 2
    },
]
