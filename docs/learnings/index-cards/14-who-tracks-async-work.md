# Learning Card 14: Who Tracks Async Work

Three pieces:

- `Promise` = future result
- event loop = keeps Node moving
- Node/libuv runtime = tracks async work and signals completion

Flow:

1. start async work
2. get promise now
3. function pauses at `await`
4. event loop handles other work
5. runtime marks work complete
6. promise resolves and function resumes
