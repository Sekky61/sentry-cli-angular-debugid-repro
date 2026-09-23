# sentry-cli-angular-debugid-repro

`sentry sourcemap inject` skips Angular 22.1 output, so the `_sentryDebugIds` runtime snippet is never added.

The project is the unmodified output of `ng new --minimal` (`@angular/cli` 22.1.7, first commit). The second
commit only adds the `sentry` CLI and a `repro` script.

```sh
npm ci
npm run repro
```

`repro` runs `ng build --source-map`, then `sentry sourcemap inject` on the output, and finally lists every JS
file that still has no `_sentryDebugIds` snippet.

## Result

```
│ Files modified │ 0 │
│ Files skipped  │ 1 │
– dist/sentry-cli-angular-debugid-repro/browser/main-MD3FQKHN.js → 2b587950-0f21-54de-a811-573df9dc25b4
dist/sentry-cli-angular-debugid-repro/browser/main-MD3FQKHN.js
```

Since 22.1 ([angular/angular-cli#33110](https://github.com/angular/angular-cli/pull/33110)) `ng build` writes an
ECMA-426 debug ID into every script that has a source map: a `//# debugId=` comment in the JS and a `debugId`
field in the map. It does not write the `_sentryDebugIds` snippet. The CLI treats the comment as proof that the
file is already injected and skips it, so the SDK never learns the ID and events carry no `debug_meta`.
