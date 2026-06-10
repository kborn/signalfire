# Secure Cookie

## Core Idea

`Secure` means the browser only sends the cookie over HTTPS.

## In This Repo

The admin auth cookie should be `Secure` in deployed environments. Local HTTP
development usually needs this relaxed unless local HTTPS is configured.

## Why

This prevents the cookie from being sent over plain HTTP in real deployments.

## Common Mistake

Turning on `Secure` in a plain local HTTP environment and then thinking auth is
broken when the browser refuses to send the cookie.
