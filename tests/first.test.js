import Machine from "../src/L/Machine";

//first.test.js
test('Machine Test', () => {

    const m = new Machine({
        axiom: '(L 1)',
        rule: {
            'L x': '(B 1)[\(L x)]/(L x)',
            'B x': '(B x+1)'
        }
    })

    console.log('hello')

    expect(Math.max(1, 5, 10)).toBe(10);
});