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
    constructor(options) {

        this.ctx = null

        this.update(options)
    }

    update(options) {
        this.saveable = options.saveable || false
        this.name = options.name || ''
        this.angle = options.angle || 30
        this.axiom = options.axiom || ''
        this.rules = options.rules || {}
        this.iterations = options.iterations || Math.floor(options.iterations_max/2) || 0
        this.iterations_max = options.iterations_max || 10
        this.diameter = options.diameter || 300
        this.start = options.start || [0,0]
        this.power = options.power || 1
        this.dir = options.dir || [1,0]
    }

    save(){
        let {name, angle, axiom, rules, saveable, iterations, diameter, power} = this
        if(saveable)
        localStorage.setItem('figure', JSON.stringify({name, angle, axiom, rules, saveable, iterations, diameter, power}));
    }



    get keys(){
        let keys = []

        for(let i=0; i<this.axiom.length; i++) {
            let ch = this.axiom.charAt(i);
            if (/^([a-zа-яА-ЯA-Z0-9])$/.test(ch) && !keys.includes(ch))
                keys.push(ch)
        }

        while(true){
            let count = keys.length
            keys.forEach(key => {
                if(!(key in this.rules)){
                    this.rules[key] = {
                        replace: key,
                        color: randomRgbColor()
                    }
                }

                for(let i=0; i<this.rules[key].replace.length; i++) {
                    let ch = this.rules[key].replace.charAt(i);
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
                if (ch in this.rules) {
                    new_rule += this.rules[ch].replace
                }else{
                    new_rule += ch
                }
            }
            rule = new_rule
        }
        return rule
    }

    get elements_count(){
        let c = 0
        let rule = this.rule
        for(let j=0; j < rule.length; j++) {
            let ch = rule.charAt(j);
            if (ch in this.rules && this.rules[ch].draw) {
                c++
            }
        }
        return c
    }

    draw(){
        let group = this.ctx.makeGroup()
        let rule = this.rule


        let turtle = new Turtle(new Two.Vector(this.start[0]+this.ctx.width/2-this.dir[0]*this.diameter/2, this.start[1]+this.ctx.height/2-this.dir[1]*this.diameter/2), (new Two.Vector(this.dir[0],this.dir[1])).multiply(this.diameter/Math.pow(this.elements_count, 1/this.power)))

        let k = 0

        let stack = []
        for(let j=0; j < rule.length; j++) {
            let ch = rule.charAt(j);

            if (ch in this.rules && this.rules[ch].draw) {
                k++
                if(k>10000) break
                let p1 = turtle.p.clone().add(turtle.v)
                let line = new Two.Line(turtle.p.x, turtle.p.y, p1.x, p1.y)
                turtle.p = p1
                line.stroke = this.rules[ch].color;
                line.linewidth = 2;
                group.add(line)
            } else if (ch === '[') {
                stack.push(turtle.copy)
            } else if (ch === ']') {
                let t = stack.pop()
                if(t) turtle = t
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
    let r1 = randomInteger(15);
    let r2 = randomInteger(15);
    let g1 = randomInteger(15);
    let g2 = randomInteger(15);
    let b1 = randomInteger(15);
    let b2 = randomInteger(15);
    let s = '0123456789abcdef'

    return `#${s[r1]}${s[r2]}${s[g1]}${s[g2]}${s[b1]}${s[b2]}`;
}