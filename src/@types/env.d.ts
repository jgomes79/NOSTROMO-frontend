interface ImportMetaEnv {
  VITE_WC_PROJECT_ID: string;
  VITE_WC_RELAY_URL: string;
  VITE_SNAP_ORIGIN: string;
  VITE_SNAP_VERSION: string;
  VITE_HTTP_ENDPOINT: string;
  VITE_HTTP_TICK_OFFSET: string;
  VITE_APP_ENV: "prod" | "sta" | "dev";
  VITE_APP_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface EthereumProvider {
  isMetaMask?: boolean; // True if the provider is MetaMask
  detected?: Array<unknown>; // Array of detected providers
  request: (request: { method: string; params?: unknown }) => Promise<unknown>;
  setProvider: (provider: string) => void; // Add this line
  providers: Array<unknown>; // Array of providers
}
