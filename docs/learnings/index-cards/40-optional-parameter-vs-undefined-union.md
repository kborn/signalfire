# Optional Parameter Vs Undefined Union

`value?: string` and `value: string | undefined` are related, but they do not
mean exactly the same thing in a function signature.

`value?: string` means the argument itself is optional. The caller may omit it:

```ts
function read(value?: string) {}

read();
read('x');
```

`value: string | undefined` means the argument position is still required, but
the value passed into that position may be `undefined`:

```ts
function read(value: string | undefined) {}

read(undefined);
read('x');
```

Why it matters here:
In helper methods, `string | undefined` is useful when the call site always
passes the argument slot, but the value may be missing. `?:` is better when the
argument itself is truly optional.

Rule of thumb:
Use `?:` when omission is part of the API.
Use `| undefined` when the parameter slot is required but the value may be
empty.
