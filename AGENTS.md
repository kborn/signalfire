# SignalFire Project

Read `.ai/session/IDE_DEFAULT.md`.

## Mandatory Session Init (Hard Gate)

Before sending any user-visible response (including greetings), you MUST:

1. Read `.ai/session/IDE_DEFAULT.md`.
2. Execute its required read chain fully.
3. Return the exact bootstrap first-response contract from `.ai/bootstrap/SESSION_BOOTSTRAP.md`.

If bootstrap is not completed, do not answer the user request.

The only allowed output before completion is:

`BOOTSTRAP_BLOCKED <missing_or_unreadable_paths>`

## First-Turn Enforcement

The first response in every new session must begin with:

`BOOTSTRAP_COMPLETE`

No exceptions for casual prompts such as "hi" or "hello".

## Validation Rule

Treat any response before bootstrap completion as a protocol violation.
When uncertain, stop and emit `BOOTSTRAP_BLOCKED <missing_or_unreadable_paths>`.
