const Stream = require('../src');

describe('Stream', () => {
  test('require generator function', () => {
    expect(() => new Stream()).toThrowErrorMatchingSnapshot();
  });

  test('next', () => {
    const s = Stream.of(1);
    expect(s.next()).toBe(1);
  });

  test('isDone', () => {
    const s = Stream.of();
    expect(s.isDone()).toBe(false);
    expect(s.next()).toBeUndefined();
    expect(s.isDone()).toBe(true);
  });

  test('all operators', () => {
    const s = Stream.of(1, 2, 3, 4, 5, 6, 7, 8)
      .map(x => x * x)
      .filter(x => !!x)
      .flatMap(x => Stream.of(-x))
      .skip(4)
      .take(2);

    expect(s.toArray()).toEqual([-25, -36]);
  });
});
