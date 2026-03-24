# Learning Card 07: Node Blocking vs Async

Node usually runs JS on one main thread.

Critical rule:

- slow `async` I/O usually does **not** block Node
- slow synchronous JS **does** block Node

Examples:

- `await prisma.topic.findMany()` = usually not blocking
- big loop / heavy CPU work = blocking

`await` pauses this function, not the whole process.

If one synchronous function runs for a long time, other requests can stall.

To avoid blocking:

- prefer async I/O
- move CPU-heavy work to worker threads, background jobs, or another service
