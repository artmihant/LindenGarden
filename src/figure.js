import Two from "two.js";

class Turtle{
    constructor(p,v) {
        this.p = (new Two.Vector()).copy(p)
        this.v = (new Two.Vector()).copy(v)
    }
    get copy(){
        return new Turtle(this.p, this.v)
    }
}

export default class Figure{
    constructor() {

        this.ctx = null

        this.angle = 30

        this.iterations = 5

        this.start = new Two.Vector(0,0)
        this.dir = new Two.Vector(0,-1 )

        this.len = 256

        this.axiom = '0'

        this.branches = {
            '0': {replace: '1[+0]-0', color: '#027202'},
            '1': {replace: '11', color: '#2c1d00'},
        }
    }

    get rules(){
        let keys = []

        for(let i=0; i<this.axiom.length; i++) {
            let ch = this.axiom.charAt(i);
            if (/^([a-zа-яА-ЯA-Z0-9])$/.test(ch) && !keys.includes(ch))
                keys.push(ch)
        }

        while(true){
            let count = keys.length
            keys.forEach(key => {
                if(!(key in this.branches)){
                    this.branches[key] = {
                        replace: key,
                        color: randomRgbColor()
                    }
                }

                for(let i=0; i<this.branches[key].replace.length; i++) {
                    let ch = this.branches[key].replace.charAt(i);
                    if (/^([a-zа-яА-ЯA-Z0-9])$/.test(ch) && !keys.includes(ch))
                        keys.push(ch)
                }
            })
            if(count === keys.length) break
        }
        return keys
    }

    setCanvas(ctx){
        this.ctx = ctx
    }

    get rule(){
        let rule = this.axiom
        for(let i=0; i<this.iterations; i++){
            let new_rule = ''
            for(let j=0; j < rule.length; j++){
                let ch = rule.charAt(j);
                if (ch in this.branches) {
                    new_rule += this.branches[ch].rule
                }else{
                    new_rule += ch
                }
            }
            rule = new_rule
        }
        return rule
    }

    draw(){
        let group = this.ctx.makeGroup()

        let turtle = new Turtle(this.start, this.dir.clone().multiply(this.len/Math.pow(2, this.iterations)))

        let rule = this.rule

        let stack = []
        for(let j=0; j < rule.length; j++) {
            let ch = rule.charAt(j);

            if (ch in this.branches) {
                let p1 = turtle.p.clone().add(turtle.v)
                let line = new Two.Line(turtle.p.x, turtle.p.y, p1.x, p1.y)
                turtle.p = p1
                line.stroke = this.branches[ch].color;
                line.linewidth = 2;
                group.add(line)
            } else if (ch === '[') {
                stack.push(turtle.copy)
            } else if (ch === ']') {
                turtle = stack.pop()
            } else if (ch === '+') {
                turtle.v.rotate(Math.PI*this.angle/180)
            } else if (ch === '-') {
                turtle.v.rotate(-Math.PI*this.angle/180)
            }
        }
    }

}
function randomInteger(max) {
    return Math.floor(Math.random()*(max + 1));
}
function randomRgbColor() {
    let r = randomInteger(255);
    let g = randomInteger(255);
    let b = randomInteger(255);
    return [r,g,b];
}