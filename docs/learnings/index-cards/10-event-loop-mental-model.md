# Learning Card 10: Event Loop Mental Model

Node usually runs JS on one main thread.

Bad:

- long sync loops
- heavy CPU work in request path
- sync file/crypto/compression work

Usually fine:

- DB calls with `await`
- HTTP calls with `await`
- most I/O

Rule:

- blocking sync work stalls the process
- `await` pauses this function, not the whole app
