interface ImportMetaEnv {
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
