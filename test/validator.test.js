import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, isStrongPassword, normalizeUsername } from '../src/validator.js';

test('isValidEmail accepts well-formed addresses', () => {
  assert.equal(isValidEmail('student@christuniversity.in'), true);
  assert.equal(isValidEmail('a.b+tag@example.co.uk'), true);
});

test('isValidEmail rejects malformed addresses', () => {
  assert.equal(isValidEmail('no-at-sign'), false);
  assert.equal(isValidEmail('two@@example.com'), false);
  assert.equal(isValidEmail('trailing@dot.'), false);
  assert.equal(isValidEmail(42), false);
});

test('isStrongPassword enforces length and character classes', () => {
  assert.equal(isStrongPassword('DevOps2026'), true);
  assert.equal(isStrongPassword('short1A'), false);
  assert.equal(isStrongPassword('alllowercase1'), false);
  assert.equal(isStrongPassword('ALLUPPERCASE1'), false);
  assert.equal(isStrongPassword('NoDigitsHere'), false);
});

test('normalizeUsername trims and lowercases', () => {
  assert.equal(normalizeUsername('  SamuelShine  '), 'samuelshine');
  assert.throws(() => normalizeUsername(undefined), TypeError);
});
