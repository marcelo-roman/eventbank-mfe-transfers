# EventBank Transfers micro-frontend

The transfers screens of [EventBank](https://github.com/marcelo-roman/eventbank-platform): send a transfer and follow its saga. Each transfer expands into its steps (requested, debited, credited, or declined and refunded) next to the events in its stream, and the list keeps polling while any transfer is still running.

The step logic lives in [`sagaSteps.ts`](src/transfers/sagaSteps.ts) and is covered by unit tests.

It is a [Module Federation](https://module-federation.io) remote of [eventbank-shell](https://github.com/marcelo-roman/eventbank-shell): it exposes `./App`, which the shell mounts at `/transfers`. It ships with its own query client and its own styles, and uses the shell's theme for everything shared.

## Running

```bash
pnpm install
pnpm dev          # http://localhost:5175, standalone, API proxied to the gateway on :5100
pnpm build        # dist/remoteEntry.js is what the shell loads
pnpm test
```

Standalone, the page links the theme from the shell dev server at `http://localhost:5173/theme.css`, so start the shell too for the full look. To run everything at once, use [eventbank-platform](https://github.com/marcelo-roman/eventbank-platform).

## License

[MIT](LICENSE)
