import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";

/** @typedef {typeof WALLET_AUTHORIZED_EVENT_TYPE} WalletAuthorizedEventType */

/** @typedef {typeof WALLET_DISCONNECTED_EVENT_TYPE} WalletDisconnectedEventType */

/** @typedef {typeof ERROR_EVENT_TYPE} ErrorEventType */

/** @typedef {CustomEvent<import("@solana-mobile/mobile-wallet-adapter-protocol").Account[]>} WalletAuthorizedEvent */

/** @typedef {CustomEvent<undefined>} WalletDisconnectedEvent */

/** @typedef {CustomEvent<Error>} ErrorEvent */

/**
 * @template TReturn
 * @typedef {(wallet: import("@solana-mobile/mobile-wallet-adapter-protocol").MobileWallet) => TReturn} TransactCallback<TReturn>
 */

/**
 * @template TReturn
 * @typedef {{ val: TReturn } | { err: Error }} TransactReturn<TReturn>
 */

export const WALLET_AUTHORIZED_EVENT_TYPE =
  "solana-mwa-button:wallet-authorized";

export const WALLET_DISCONNECTED_EVENT_TYPE =
  "solana-mwa-button:wallet-disconnected";

export const ERROR_EVENT_TYPE = "solana-mwa-button:error";

export const CLUSTER_ATTR_NAME = "cluster";

export const NAME_ATTR_NAME = "name";

export const URI_ATTR_NAME = "uri";

export const ICON_ATTR_NAME = "icon";

export const SOLANA_MWA_BUTTON_ELEM_TAG = "solana-mwa-button";

export const ICON_DATA =
  "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI4IiB3aWR0aD0iMjgiIHZpZXdCb3g9Ii0zIDAgMjggMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI0RDQjhGRiI+PHBhdGggZD0iTTE3LjQgMTcuNEgxNXYyLjRoMi40di0yLjRabTEuMi05LjZoLTIuNHYyLjRoMi40VjcuOFoiLz48cGF0aCBkPSJNMjEuNiAzVjBoLTIuNHYzaC0zLjZWMGgtMi40djNoLTIuNHY2LjZINC41YTIuMSAyLjEgMCAxIDEgMC00LjJoMi43VjNINC41QTQuNSA0LjUgMCAwIDAgMCA3LjVWMjRoMjEuNnYtNi42aC0yLjR2NC4ySDIuNFYxMS41Yy41LjMgMS4yLjQgMS44LjVoNy41QTYuNiA2LjYgMCAwIDAgMjQgOVYzaC0yLjRabTAgNS43YTQuMiA0LjIgMCAxIDEtOC40IDBWNS40aDguNHYzLjNaIi8+PC9nPjwvc3ZnPg==";

export class SolanaMwaButton extends HTMLElement {
  /** @type {?import("@solana-mobile/mobile-wallet-adapter-protocol").AuthToken} */
  #authToken;

  /** @type {import("@solana-mobile/mobile-wallet-adapter-protocol").Account[]} */
  #accounts;

  /** @returns {boolean} */
  get isAuthorized() {
    return this.#authToken !== null;
  }

  /** @returns {import("@solana-mobile/mobile-wallet-adapter-protocol").AppIdentity} */
  get appIdentity() {
    return {
      name: this.getAttribute(NAME_ATTR_NAME) ?? undefined,
      uri: this.getAttribute(URI_ATTR_NAME) ?? undefined,
      icon: this.getAttribute(ICON_ATTR_NAME) ?? undefined,
    };
  }

  /** @returns {import("@solana-mobile/mobile-wallet-adapter-protocol").Cluster} */
  get cluster() {
    // @ts-ignore
    return this.getAttribute(CLUSTER_ATTR_NAME) ?? "mainnet-beta";
  }

  /** @returns {readonly import("@solana-mobile/mobile-wallet-adapter-protocol").Account[]} */
  get accounts() {
    return this.#accounts;
  }

  /** @returns {string[]} */
  static get observedAttributes() {
    return [NAME_ATTR_NAME, URI_ATTR_NAME, ICON_ATTR_NAME, CLUSTER_ATTR_NAME];
  }

  /**
   *
   * @param {string} name
   */
  attributeChangedCallback(name) {
    if (
      name === NAME_ATTR_NAME ||
      name === URI_ATTR_NAME ||
      name === ICON_ATTR_NAME ||
      name === CLUSTER_ATTR_NAME
    ) {
      this.disconnect();
    }
  }

  constructor() {
    super();
    this.#authToken = null;
    this.#accounts = [];

    const btn = document.createElement("button");
    const icon = document.createElement("img");
    icon.src = ICON_DATA;
    icon.alt = "Mobile Wallet Adapter icon";
    btn.appendChild(icon);
    const txt = document.createTextNode("Mobile Wallet Adapter");
    btn.appendChild(txt);
    btn.onclick = this.#authorize.bind(this);

    this.appendChild(btn);
  }

  /**
   * @template TReturn
   * @param {TransactCallback<TReturn>} callback
   * @returns {Promise<TransactReturn<TReturn>>}
   */
  async transact(callback) {
    try {
      const authToken = this.#authToken;
      if (!authToken) {
        throw new Error("not yet authorized");
      }
      const res = await transact(async (wallet) => {
        const authResult = await wallet.reauthorize({
          auth_token: authToken,
          identity: this.appIdentity,
        });
        this.#authToken = authResult.auth_token;
        return callback(wallet);
      });
      return { val: res };
    } catch (e) {
      this.#emitError(e);
      return { err: e };
    }
  }

  disconnect() {
    const authToken = this.#authToken;
    if (!authToken) {
      return;
    }
    this.#authToken = null;
    this.#accounts = [];
    /** @type {WalletDisconnectedEvent} */
    const evt = new CustomEvent(WALLET_DISCONNECTED_EVENT_TYPE, {
      bubbles: true,
    });
    this.dispatchEvent(evt);
    // TODO: deauthorize API exists but involves an (unnecessary) brief switch to the app.
    // Examples also dont show it being used, so its probably ok to not do it?
    // transact((wallet) => wallet.deauthorize({ auth_token: authToken }));
  }

  async #authorize() {
    if (this.isAuthorized) {
      return;
    }
    try {
      // eslint-disable-next-line camelcase
      const { accounts, auth_token } = await transact((wallet) =>
        wallet.authorize({
          cluster: this.cluster,
          identity: this.appIdentity,
        })
      );
      this.#accounts = accounts;
      // eslint-disable-next-line camelcase
      this.#authToken = auth_token;
      /** @type {WalletAuthorizedEvent} */
      const evt = new CustomEvent(WALLET_AUTHORIZED_EVENT_TYPE, {
        bubbles: true,
        detail: this.#accounts,
      });
      this.dispatchEvent(evt);
    } catch (e) {
      this.#emitError(e);
    }
  }

  /**
   *
   * @param {Error} err
   */
  #emitError(err) {
    console.error(err);
    /** @type {ErrorEvent} */
    const evt = new CustomEvent(ERROR_EVENT_TYPE, {
      bubbles: true,
      detail: err,
    });
    this.dispatchEvent(evt);
  }
}

/**
 * window.customElements.define() the web component so that it can be used
 *
 * @param {string | null | undefined} [htmlTag] defaults to `solana-mwa-button` if not provided
 */
export function defineCustomElement(htmlTag) {
  const name = htmlTag ?? SOLANA_MWA_BUTTON_ELEM_TAG;
  window.customElements.define(name, SolanaMwaButton);
}
