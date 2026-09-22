/**
 * A tiny calculator module. Exists to give the CI pipeline something
 * real to lint, test and build.
 */

export function add(a, b) {
  assertNumbers(a, b);
  return a + b;
}

export function subtract(a, b) {
  assertNumbers(a, b);
  return a - b;
}

export function multiply(a, b) {
  assertNumbers(a, b);
  return a * b;
}

export function divide(a, b) {
  assertNumbers(a, b);
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

function assertNumbers(...values) {
  for (const value of values) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new TypeError(`Expected a number, received: ${String(value)}`);
    }
  }
}
