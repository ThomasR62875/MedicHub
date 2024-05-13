import sum from './sum';

describe('sum function', () => {
    it('adds two numbers', () => {
        expect(sum(1, 2)).toBe(3);
    });

    it('adds two negative numbers', () => {
        expect(sum(-1, -2)).toBe(-3);
    });

    it('adds a positive and a negative number', () => {
        expect(sum(5, -3)).toBe(2);
    });
});


test('truthiness', () => {
    const n = null;
    // expect(n).toBeFalsy();
    // expect(n).toBeTruthy();
    expect(n).toBeNull();
    // expect(n).toBeUndefined();
    // expect(n).not.toBeDefined();
});

test('toEqualVStoBe', () => {
    const data = {one: 1, two: 3};
    expect(data).toEqual({one: 1, two: 3});

    const newData = {one: 1, two: 3};
    expect(data).toEqual(newData);
    expect(data).toBe(newData);   // falla pues nueva variable

});


test('numbers', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);

    const decimal = 0.1 + 0.2;
    expect(decimal).toBe(0.3);
    expect(decimal).toBeCloseTo(0.3);
});


test('strings', () => {

    expect('strIngs').toMatch(/I/);   // se puede pasar a minuscula y q no pase el test

    expect('Estrellado').toMatch(/Estrella/);
})


const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'milk',
];

test('iterables', () => {
    expect(shoppingList).toContain('milk');
    expect(new Set(shoppingList)).toContain('milk');
});



import { forEach } from './forEach';

const mockCallback = jest.fn((x: number) => 42 + x);

test('forEach mock function', () => {
    forEach([0, 1], mockCallback);

    // La función simulada se llamó dos veces
    expect(mockCallback.mock.calls).toHaveLength(2);

    // El primer argumento de la primera llamada a la función fue 0
    expect(mockCallback.mock.calls[0][0]).toBe(1);

    // El primer argumento de la segunda llamada a la función fue 1
    expect(mockCallback.mock.calls[1][0]).toBe(1);

    // El valor de retorno de la primera llamada a la función fue 42
    expect(mockCallback.mock.results[0].value).toBe(42);
});
