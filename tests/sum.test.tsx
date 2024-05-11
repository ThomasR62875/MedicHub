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
