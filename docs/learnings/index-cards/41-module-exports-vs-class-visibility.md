# Module Exports vs Class Visibility

`export` controls whether another file can import a value from this file.

`public` and `private` control whether code can access class members after the
class is already in scope.

Rule of thumb:

- no `export` = file-local only
- `export class TimeHelper {}` = other files can import the class
- `private method()` = only that class can call the method
- methods without a modifier are `public` by default

Example:

```ts
export class TimeHelper {
  freeze() {
    return this.normalize();
  }

  private normalize() {
    return new Date();
  }
}
```

Other files can import `TimeHelper` and call `freeze()`, but they cannot call
`normalize()`.
