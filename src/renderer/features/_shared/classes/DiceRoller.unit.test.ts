import { DiceRoller } from "@/class";
import 'jest';
import { mockRandom, resetMockRandom } from 'jest-mock-random';

afterEach(() => {
  resetMockRandom();
});

// _rollDie tests
test('_rollDie expect correct .random breakpoints', () => {
  mockRandom(.0000);
  expect(DiceRoller._rollDie(10)).toBe(1);

  mockRandom(.0999);
  expect(DiceRoller._rollDie(10)).toBe(1);

  mockRandom(.1000);
  expect(DiceRoller._rollDie(10)).toBe(2);

  mockRandom(.5000);
  expect(DiceRoller._rollDie(10)).toBe(6);

  mockRandom(.9000);
  expect(DiceRoller._rollDie(10)).toBe(10);

  mockRandom(.9999);
  expect(DiceRoller._rollDie(10)).toBe(10);
});

test('_rollDie should round down float dieType args', () => {
  mockRandom(.9000);
  expect(DiceRoller._rollDie(2.999999)).toBe(2);
});

test('_rollDie should turn negative die type into a zero result', () => {
  mockRandom(.9000);
  expect(DiceRoller._rollDie(-10)).toBe(0);
});

// _rollAccuracyDice tests

'_rollAccuracyDice should return zero for zero dice rolled'
'_rollAccuracyDice should return a negative result for net difficulty dice'
'_rollAccuracyDice should return a positive result for net accuracy dice'
