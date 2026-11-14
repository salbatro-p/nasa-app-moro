# Persistent delivery requirement

The user requires every project update to be saved to `https://github.com/salbatro-p/nasa-app-moro`.

- Preserve `origin` as that GitHub repository. Sites source storage and publication do not satisfy GitHub synchronization.
- After appropriate validation, commit the completed changes and run `node scripts/sync-github.mjs`.
- Verify that GitHub `refs/heads/main` equals the local delivered commit. Do not claim synchronization from a local commit, a Sites push, or an attempted GitHub push.
- Never force-push or overwrite independent remote work. Reconcile remote changes before retrying a rejected push.
- If authentication or permissions block delivery, report the exact blocker promptly and preserve all work locally. Once access is restored, synchronize the accumulated work before the next feature change.
- Authentication must use the connected integration or Git Credential Manager. Never put credentials in source files, remote URLs, logs, or chat.

This is a per-update completion requirement, not an installed background synchronization service.
