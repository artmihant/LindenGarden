export default class Machine {
    constructor({axiom, rule}) {
        // Аксиома - начальная строка
        //         0 : (L 1)
        this.axiom = axiom

        // правило построения строки
        //         'L x': '(B 1)[\(L x)]/(L x)',
        //         'B x': '(B x+1)'
        this.rule = rule
    }

    programIter(code, iterations){
        if (iterations <= 0) return code

        let new_code = ''

        let pointer = 0
        while(pointer < code.length){
            let char = code.charAt(pointer);
            if(char === '('){
                let template = '('
                while (char !== ')'){
                    pointer++
                    char = code.charAt(pointer);
                    template += char
                }
                new_code += this.replace(template, iterations < 1 ? iterations : 1)
            }else{
                new_code += char
            }
            pointer++
        }
        return this.programIter(new_code, iterations-1)
    }

    program(iteration){
        return this.programIter(this.axiom, iteration)
    }
}

    /*
    итерации:


    1.3 (B x) = '(B 0.3*(x+1)) (B 0.7*x)'

    1.3 (L 1) = '(B 0.3)[\(L 0.3)]/(L 0.3) (L 0.7)'


    0 : (L 1)
    0.3 : (B 0.3)[\(L 0.3)]/(L 0.3) (L 0.7)
    1: (B 1)[\(L 1)]-(L 1)
    2: (B 2)[\(B 1)[\(L 1)]/(L 1)]/(B 1)[\(L 1)]/(L 1)
    2.3: (B 2.3) [\(B 1)[\(L 1)]/(L 1)]/(B 1)[\(L 1)]/(L 1)


    L -> (0.7)L(0.3)B[+(0.3)L]-(0.3)L
    B -> (0.7)B(1.41)(0.3)B

    rule0: {'L': 'L', 'B': 'B'}
    rule1: {'L': 'B[+L]-L', 'B': '(1.41)B'}

    (0.7).rule0 = {'L': '(0.7)L', 'B': '(0.7)B'}
    (0.3).rule1 = {'L': '(0.3)B[+(0.3)L]-(0.3)L', 'B': '(1.41)(0.3)B'}


    (0.7).rule0 + (0.3).rule1 = {
        'L': '(0.7)L(0.3)B[+(0.3)L]-(0.3)L',
        'B': '(0.7)B(1.41)(0.3)B'
    }
    */

