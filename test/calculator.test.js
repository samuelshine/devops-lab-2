import test from 'node:test';
import assert from 'node:assert/strict';
import { add, subtract, multiply, divide } from '../src/calculator.js';

test('add sums two numbers', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1, 1), 0);
});

test('subtract finds the difference', () => {
  assert.equal(subtract(10, 4), 6);
  assert.equal(subtract(0, 5), -5);
});

test('multiply finds the product', () => {
  assert.equal(multiply(6, 7), 42);
  assert.equal(multiply(5, 0), 0);
});

test('divide finds the quotient', () => {
  assert.equal(divide(20, 5), 4);
});

test('divide rejects a zero divisor', () => {
  assert.throws(() => divide(1, 0), /Division by zero/);
});

test('operations reject non-numeric input', () => {
  assert.throws(() => add('2', 3), TypeError);
  assert.throws(() => multiply(null, 3), TypeError);
  assert.throws(() => subtract(NaN, 3), TypeError);
});
