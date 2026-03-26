# Await Looks Sequential But Is Still Async

`await` makes asynchronous code read in top-to-bottom order, but Node can still
pause that function while I/O is in progress and do other work meanwhile.

Why it matters here:
In Phase 6.2, a page may `await fetch(...)` before rendering HTML. That request
flow is ordered for that one page render, but it is still asynchronous because
Node is waiting on network I/O instead of blocking the whole process with
synchronous work.

Rule of thumb:
`await` means "pause this function until the result is ready," not "turn this
operation into blocking synchronous work."
