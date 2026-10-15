# EventBank PIX micro-frontend

The PIX screens of [EventBank](https://github.com/marcelo-roman/eventbank-platform): look a key up and see who it belongs to (masked) before sending, follow every transfer that touches your accounts through its saga steps, and register or remove your keys (CPF and e-mail prefilled from your approved application, phone, or a random key).

It is a [Module Federation](https://module-federation.io) remote of [eventbank-shell](https://github.com/marcelo-roman/eventbank-shell): it exposes `./App`, which the shell mounts at `/pix` and renders with an `auth` prop (the signed-in user and a function that returns a fresh access token). Every API call sends that token. It ships with its own query client and styles, and uses the shell's theme for everything shared.

## Running

```bash
pnpm install
pnpm dev          # http://localhost:5175, standalone, API proxied to the gateway on :5100
pnpm build        # dist/remoteEntry.js is what the shell loads
pnpm test
```

Standalone, the app reads an access token from `localStorage["eventbank.devToken"]` and links the theme from the shell dev server at `http://localhost:5173/theme.css`. To run everything together, with sign-in, use [eventbank-platform](https://github.com/marcelo-roman/eventbank-platform).

## License

[MIT](LICENSE)
