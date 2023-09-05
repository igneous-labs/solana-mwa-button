/**
 * window.customElements.define() the web component so that it can be used
 *
 * @param {string | null | undefined} [htmlTag] defaults to `solana-mwa-button` if not provided
 */
export function defineCustomElement(htmlTag?: string | null | undefined): void;
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
export const WALLET_AUTHORIZED_EVENT_TYPE: "solana-mwa-button:wallet-authorized";
export const WALLET_DISCONNECTED_EVENT_TYPE: "solana-mwa-button:wallet-disconnected";
export const ERROR_EVENT_TYPE: "solana-mwa-button:error";
export const CLUSTER_ATTR_NAME: "cluster";
export const NAME_ATTR_NAME: "name";
export const URI_ATTR_NAME: "uri";
export const ICON_ATTR_NAME: "icon";
export const SOLANA_MWA_BUTTON_ELEM_TAG: "solana-mwa-button";
export const ICON_DATA: "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI4IiB3aWR0aD0iMjgiIHZpZXdCb3g9Ii0zIDAgMjggMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI0RDQjhGRiI+PHBhdGggZD0iTTE3LjQgMTcuNEgxNXYyLjRoMi40di0yLjRabTEuMi05LjZoLTIuNHYyLjRoMi40VjcuOFoiLz48cGF0aCBkPSJNMjEuNiAzVjBoLTIuNHYzaC0zLjZWMGgtMi40djNoLTIuNHY2LjZINC41YTIuMSAyLjEgMCAxIDEgMC00LjJoMi43VjNINC41QTQuNSA0LjUgMCAwIDAgMCA3LjVWMjRoMjEuNnYtNi42aC0yLjR2NC4ySDIuNFYxMS41Yy41LjMgMS4yLjQgMS44LjVoNy41QTYuNiA2LjYgMCAwIDAgMjQgOVYzaC0yLjRabTAgNS43YTQuMiA0LjIgMCAxIDEtOC40IDBWNS40aDguNHYzLjNaIi8+PC9nPjwvc3ZnPg==";
export class SolanaMwaButton extends HTMLElement {
    /** @returns {string[]} */
    static get observedAttributes(): string[];
    /** @returns {boolean} */
    get isAuthorized(): boolean;
    /** @returns {import("@solana-mobile/mobile-wallet-adapter-protocol").AppIdentity} */
    get appIdentity(): Readonly<{
        uri?: string;
        icon?: string;
        name?: string;
    }>;
    /** @returns {import("@solana-mobile/mobile-wallet-adapter-protocol").Cluster} */
    get cluster(): import("@solana-mobile/mobile-wallet-adapter-protocol").Cluster;
    /** @returns {readonly import("@solana-mobile/mobile-wallet-adapter-protocol").Account[]} */
    get accounts(): readonly Readonly<{
        address: string;
        label?: string;
    }>[];
    /**
     *
     * @param {string} name
     */
    attributeChangedCallback(name: string): void;
    /**
     * @template TReturn
     * @param {TransactCallback<TReturn>} callback
     * @returns {Promise<TransactReturn<TReturn>>}
     */
    transact<TReturn>(callback: TransactCallback<TReturn>): Promise<TransactReturn<TReturn>>;
    disconnect(): void;
    #private;
}
export type WalletAuthorizedEventType = typeof WALLET_AUTHORIZED_EVENT_TYPE;
export type WalletDisconnectedEventType = typeof WALLET_DISCONNECTED_EVENT_TYPE;
export type ErrorEventType = typeof ERROR_EVENT_TYPE;
export type WalletAuthorizedEvent = CustomEvent<import("@solana-mobile/mobile-wallet-adapter-protocol").Account[]>;
export type WalletDisconnectedEvent = CustomEvent<undefined>;
export type ErrorEvent = CustomEvent<Error>;
/**
 * <TReturn>
 */
export type TransactCallback<TReturn> = (wallet: import("@solana-mobile/mobile-wallet-adapter-protocol").MobileWallet) => TReturn;
/**
 * <TReturn>
 */
export type TransactReturn<TReturn> = {
    val: TReturn;
} | {
    err: Error;
};
