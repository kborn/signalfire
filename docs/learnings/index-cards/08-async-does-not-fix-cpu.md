# Learning Card 08: Async Does Not Fix CPU Work

`async` does not make synchronous CPU work non-blocking.

This still blocks Node:

```ts
async function bad() {
  doHeavyCpuWork();
}
```

Why:

- `async` changes return type to `Promise`
- it does **not** move CPU work off the main thread

To avoid blocking:

- worker threads
- child process
- background job
- separate service
