# Localhost Port Changes Origin

Changing only the port still changes the browser origin.

Why it matters here:

`http://localhost:3000` and `http://localhost:3001` are different origins, so a
browser request between them is cross-origin and may need CORS handling.

Rule of thumb:

- protocol + host + port together define the origin
