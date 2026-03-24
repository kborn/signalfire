# Learning Card 11: Promises, Async, Await

- `Promise` = value later
- `async` = this function returns a promise
- `await` = pause here until the promise resolves

Rules:

- using `await` requires `async`
- returning a promise does not require `async`
- `return await ...` is usually unnecessary unless doing extra logic

Example:

```ts
function findBySlug(slug: string) {
  return this.repository.findBySlug(slug);
}
```
