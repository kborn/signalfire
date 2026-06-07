# Bcrypt Hash Vs Salt

## Core Idea

A salt is random data mixed into a password before hashing so that the same
password does not always produce the same stored result.

With `bcrypt`, the salt is stored inside the resulting hash string. You usually
do not store a separate `passwordSalt` column.

## Why Salt Exists

Without a salt:

- two users with the same password would have the same stored hash
- precomputed lookup attacks are easier

With a salt:

- each password hash is unique even when two users choose the same password
- an attacker has to attack each stored hash individually

## What The Database Usually Stores

For a normal `bcrypt` setup, one field is enough:

- `passwordHash`

That stored hash string includes:

- the bcrypt version
- the cost factor
- the salt
- the resulting hash output

## How Verification Works

On login:

1. load the stored `passwordHash`
2. pass the submitted password and stored hash into `bcrypt.compare(...)`
3. `bcrypt` reads the salt and cost from the stored hash
4. `bcrypt` re-hashes the submitted password with those same values
5. compare succeeds or fails

## Rule Of Thumb

- never store plaintext passwords
- do not use a fast general-purpose hash like plain `sha256(password)`
- store one `passwordHash`
- let `bcrypt` manage salt generation and reuse during verification

## In This Repo

Phase 11.9 admin auth should treat `AdminUser.passwordHash` as the stored
credential value. A separate salt field is not required for a standard bcrypt
implementation.
