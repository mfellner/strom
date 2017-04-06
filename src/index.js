'use strict';

const fields = {
  done: Symbol(),
  generator: Symbol()
};

function assert(expression, message) {
  if (!expression || (typeof expression === 'function' && !expression())) {
    throw new Error(message);
  }
}

class Stream {
  constructor(generatorFunction) {
    assert(
      typeof generatorFunction === 'function',
      'new Stream() requires a generator function.'
    );
    this[fields.done] = false;
    this[fields.generator] = generatorFunction();
  }

  static of(...items) {
    return new Stream(function*() {
      for (let i of items) {
        yield i;
      }
    });
  }

  isDone() {
    return this[fields.done];
  }

  next() {
    const { value, done } = this[fields.generator].next();
    this[fields.done] = done;
    return value;
  }

  map(fn) {
    return new Stream(
      function*() {
        while (!this.isDone()) {
          const { value, done } = this[fields.generator].next();
          this[fields.done] = done;
          if (!done) {
            yield fn(value);
          }
        }
      }.bind(this)
    );
  }

  filter(fn) {
    return new Stream(
      function*() {
        while (!this.isDone()) {
          const { value, done } = this[fields.generator].next();
          this[fields.done] = done;
          if (!done && fn(value)) {
            yield value;
          }
        }
      }.bind(this)
    );
  }

  flatMap(fn) {
    return new Stream(
      function*() {
        while (!this.isDone()) {
          const { value, done } = this[fields.generator].next();
          this[fields.done] = done;
          if (!done) {
            yield* fn(value)[fields.generator];
          }
        }
      }.bind(this)
    );
  }

  take(n) {
    return new Stream(
      function*() {
        for (let i = 0; i < n && !this.isDone(); i += 1) {
          const { value, done } = this[fields.generator].next();
          this[fields.done] = done;
          if (!done) {
            yield value;
          }
        }
      }.bind(this)
    );
  }

  skip(n) {
    return new Stream(
      function*() {
        for (let i = 0; !this.isDone(); i += 1) {
          const { value, done } = this[fields.generator].next();
          this[fields.done] = done;
          if (!done && i >= n) {
            yield value;
          }
        }
      }.bind(this)
    );
  }

  toArray() {
    return Array.from(this[fields.generator]);
  }
}

module.exports = Stream;
