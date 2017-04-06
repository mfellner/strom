# Strom 🔀⚡

Functional, lazy streams.

### Usage

```javascript
const Stream = require('../src');

const s = Stream.of(1, 2, 3);
const xs = s.map(x => x * 2).toArray();
```
