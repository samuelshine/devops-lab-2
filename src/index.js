import { add, subtract, multiply, divide } from './calculator.js';
import { isValidEmail, isStrongPassword, normalizeUsername } from './validator.js';

// Small smoke run so `npm start` shows the module working end to end.
console.log('devops-lab-2 :: CI demo application');
console.log('2 + 3        =', add(2, 3));
console.log('10 - 4       =', subtract(10, 4));
console.log('6 * 7        =', multiply(6, 7));
console.log('20 / 5       =', divide(20, 5));
console.log('email ok     =', isValidEmail('student@christuniversity.in'));
console.log('password ok  =', isStrongPassword('DevOps2026'));
console.log('username     =', normalizeUsername('  SamuelShine  '));
