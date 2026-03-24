# IDE Session Entrypoint

Use this file to initialize in-IDE chat sessions.

This file defines session startup behavior.
It is not a role definition and does not replace `.ai/roles/` files.

## Required sequence

1. Read `.ai/bootstrap/SESSION_BOOTSTRAP.md` and complete its required read order.
2. Read `.ai/roles/STAFF_ENGINEER.md` as the default IDE role.
3. Return the required bootstrap first response contract.

## Optional phase context

After bootstrap is complete and the active phase is known, optionally check
`.ai/phase-notes/<phase>/` or similarly named files for the current
phase when they exist and are relevant to the user's request.

Authority and usage rules for canonical versus non-canonical docs are defined in
`.ai/bootstrap/DOC_AUTHORITY.md`.

## Role switching

If the user explicitly asks for another role, read that role file from `.ai/roles/` and restate role constraints before proceeding.
