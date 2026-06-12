# Filter Changes Should Reset Page

If a user is on a later page and then changes filters, the page number often
becomes invalid for the new filtered result set.

Example:

- current URL: `/articles?page=3`
- user applies topic `climate`

Usually the next URL should become:

- `/articles?topicSlug=climate`

or:

- `/articles?topicSlug=climate&page=1`

not:

- `/articles?topicSlug=climate&page=3`

Why:

- page 3 of the filtered set may not exist
- the UI can look broken even when the filter worked

Treat filter changes as a reset to the first page unless there is a strong,
explicit reason not to.
