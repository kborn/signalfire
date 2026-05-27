# React Functional State Updates

`useState` gives a value and a setter:

```tsx
const [errors, setErrors] = useState<ReviewFormErrors>({});
```

When the setter receives a function, React supplies the most recent state
value as its argument:

```tsx
setErrors((previousErrors) => ({
  ...previousErrors,
  ...fieldErrors,
}));
```

`previousErrors` is not separately declared application state. It is the
current `errors` value at the time React applies the update.

The spread expression merges objects:

```tsx
previousErrors = { title: 'Old title error' };
fieldErrors = { title: 'New server title error', reviewNotes: 'Too long' };

// Result:
{
  title: 'New server title error',
  reviewNotes: 'Too long',
}
```

Later spreads overwrite earlier properties with the same key.

Use the callback form when the next value depends on the current value:

```tsx
setSelectedTopics((previousTopics) => [...previousTopics, nextTopic]);
```

Use direct replacement when the new result should replace prior state:

```tsx
setErrors(fieldErrors);
```

In a request flow that clears errors before submitting, API validation errors
usually replace current error state rather than merge into it.

Rule of thumb:

- building on current state: `setValue((previousValue) => nextValue)`
- replacing state with a new result: `setValue(nextValue)`
