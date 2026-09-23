# sentry-cli-angular-debugid-repro

**`sentry sourcemap inject` skips Angular 22.1 build output, so the `_sentryDebugIds` runtime snippet is never
added and the SDK never learns the debug ID.** Reported in
[getsentry/cli#1629](https://github.com/getsentry/cli/issues/1629).

```sh
npm ci
npm run repro     # ng build --source-map → sentry sourcemap inject → count snippets
npm run control   # same, but Angular's debug ID is removed before injecting
```

| script    | `sentry sourcemap inject`       | `_sentryDebugIds` snippets in `main-*.js` |
|-----------|---------------------------------|-------------------------------------------|
| `repro`   | `Files modified 0`, `skipped 1` | **0**                                     |
| `control` | `Files modified 1`, `skipped 0` | 1                                         |

## Why

Since 22.1 ([angular/angular-cli#33110](https://github.com/angular/angular-cli/pull/33110)), `ng build` writes an
ECMA-426 debug ID into every script with a source map: a `//# debugId=` comment and a `debugId` field in the map.
It writes no runtime snippet. The CLI takes the comment as proof the file is already injected and skips it.

## What is in the repo

- First commit: the unmodified output of `ng new --minimal` (`@angular/cli` 22.1.7).
- `sentry@0.45.0` as a dev dependency and the two scripts above.
- `strip-angular-debug-ids.mjs` removes Angular's comment and map field (used by `control`).
- `count-snippets.mjs` prints how many snippets each JS file contains.
