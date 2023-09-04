# solana-mwa-button

Custom button for displaying a "Mobile Wallet Adapter" button that connects to the device's mobile wallet.

All HTML elements within are NOT encapsulated in the shadow DOM and completely unstyled to allow for complete styling customization.

## Example

First, add the element to the custom element registry:

```js
import { defineCustomElement } from "solana-mwa-button";

defineCustomElement(); // accepts an optional string arg for the custom element tag name, otherwise defaults to "solana-mwa-button"
```

You can now use it in your html:

```html
<solana-mwa-button
  cluster="mainnet-beta"
  name="My dApp"
  uri="https://yourdapp.com"
  icon="favicon.ico"
>
</solana-mwa-button>
```

## Basic Styling Example

```css
solana-mwa-button {
  display: block; /* custom element default to display: inline */
}

solana-mwa-button > button {
  display: flex;
  align-items: center;
  height: 3rem;
  font-size: 1rem;
}
```

You can see the result of these basic styles in the example web-app in `example/`

## Usage

### Connecting a Wallet

On click, the button initiates the connect wallet + authorize flow with the respective wallet.

On success, a `CustomEvent` is emitted with the following type:

```js
{
  type: "solana-mwa-button:wallet-authorized",
  bubbles: true,
  detail: Account[], // AuthorizationResult["accounts"]: https://github.com/solana-mobile/mobile-wallet-adapter/blob/db64eb559547ebd5abc4fe7e4e94865e694b84ff/js/packages/mobile-wallet-adapter-protocol/src/types.ts#L32C15-L32C22
}
```

### Using the Authorized Wallet

Call `.transact()` on the element as you would using [`@solana-mobile/mobile-wallet-adapter-protocol`](https://docs.solanamobile.com/react-native/quickstart#signing-transactions-and-messages), but the element handles (re)-authorization for you.

```js
const transaction = ...; //base64 encoded solana transaction
const btn = document.querySelector(
  "solana-mwa-button"
);

const { val: signedTx } = await btn.transact(async (wallet) => {
  const { signed_payloads: [signedTx] } = await wallet.signTransactions({
    payloads: [transaction],
  });
  return signedTx
});
```

See `example/index.html` for a full example

### Disconnecting the Connected Wallet

Disconnecting the connected wallet must be handled by the app by calling the element's `disconnect()` method.

```js
document.querySelector("solana-mwa-button").disconnect();
```

On `disconnect()` call, a `CustomEvent` is immediately emitted with the following type:

```js
{
  type: "solana-mwa-button:wallet-disconnected",
  bubbles: true,
}
```

### Error Handling

On encountering an error, a `CustomEvent` is emitted with the following type:

```js
{
  type: "solana-mwa-button:error",
  bubbles: true,
  detail: Error, // the error that was thrown
}
```

The error is also logged to `console.error`

## Attributes

- `cluster` defaults to `mainnet-beta` if not provided
- app identity attributes (`name`, `uri`, `icon`) defaults to `undefined` if not provided
