# sentry-cli-angular-debugid-repro

`sentry sourcemap inject` skips Angular 22.1 output, so the `_sentryDebugIds` runtime snippet is never added.

The project is the unmodified output of `ng new --minimal` (`@angular/cli` 22.1.7, first commit). The later
commits only add the `sentry` CLI and the two scripts below.

```sh
npm ci
npm run repro
npm run control
```

Both scripts run `ng build --source-map` and `sentry sourcemap inject` on the output, then print how many
`_sentryDebugIds` snippets each JS file contains. `control` additionally removes the debug ID Angular wrote
(the `//# debugId=` comment and the map's `debugId`) before injecting.

## Result

`npm run repro`:

```
│ Files modified │ 0 │
│ Files skipped  │ 1 │
dist/sentry-cli-angular-debugid-repro/browser/main-MD3FQKHN.js:0
```

`npm run control`:

```
│ Files modified │ 1 │
│ Files skipped  │ 0 │
dist/sentry-cli-angular-debugid-repro/browser/main-MD3FQKHN.js:1
```

Since 22.1 ([angular/angular-cli#33110](https://github.com/angular/angular-cli/pull/33110)) `ng build` writes an
ECMA-426 debug ID into every script that has a source map: a `//# debugId=` comment in the JS and a `debugId`
field in the map. It does not write the `_sentryDebugIds` snippet. The CLI treats the comment as proof that the
file is already injected and skips it, so the SDK never learns the ID and events carry no `debug_meta`. The same
build without Angular's debug ID gets the snippet.
