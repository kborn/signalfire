# Computed Property Names

Object keys can be written directly:

```ts
const errors = {
  title: 'Title is required',
};
```

But sometimes the key name is stored in a variable:

```ts
const uiField = 'title';
```

If you write this:

```ts
const errors = {
  uiField: 'Title is required',
};
```

the object key is literally `uiField`.

Use brackets when you want JavaScript to evaluate the variable and use its
value as the key:

```ts
const errors = {
  [uiField]: 'Title is required',
};
```

That creates:

```ts
{
  title: 'Title is required';
}
```

Why it matters here:

The moderation review API can return field names as strings, such as
`normalized.title` or `normalized.startTime`. The UI maps those API field names
to local form field names like `title` or `startTime`.

```ts
const uiField = mapApiFieldToUiField(apiError.field);

return {
  ...acc,
  [uiField]: apiError.message,
};
```

In plain English:

Keep the errors already collected, then add one new error using the field name
inside `uiField`.

Rule of thumb:

- use `title: message` when the key is known while writing the code
- use `[fieldName]: message` when the key is stored in a variable
