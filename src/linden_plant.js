

export class LindenPlant {
    // {
    //     name: 'tree',
    //     axiom: 'L(1)',
    //     rule: {
    //         'L(k)': 'B(1)[+L(k)]-L(k)',
    //         'B(k)': 'B(k+1)'
    //     },
    //     angle: 1/6,
    //     view: {
    //         'L': {type:'circle', radius: 1, color: '#00ff00'},
    //         'B': {type:'line', length: 10, width: 1, color: '#2c1d00'},
    //         'C': {type:'none'}
    //     },
    //     dir: [0,1],
    //     loc: [0,0],
    //     scale: 1,
    //     iteration: 5
    // }
    constructor(data) {

        // Название растения
        this.name = data.name

        // Аксиома - начальная строка
        this.axiom = data.axiom

        // правило построения строки
        this.rule = data.rule

        // Угол отрисовки
        this.angle = data.angle

        // правило отрисовки
        this.view = data.view

        // начальное положение черепашки
        this.dir = data.dir

        // начальное направление черепашки
        this.loc = data.loc

        //масштаб
        this.scale = data.scale

        //число итераций
        this.iteration = data.iteration
    }
}