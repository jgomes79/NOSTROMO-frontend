/// <reference types="vite-plugin-svgr/client" />

import type { MetaMaskInpageProvider } from "@metamask/providers";

declare module "*.md";
declare module "*.jpg";
declare module "*.png";
declare module "*.ico";
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*?.raw";
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

// MetaMask ethereum provider
interface EthereumProvider extends MetaMaskInpageProvider {
  detected?: EthereumProvider[];
  providers?: EthereumProvider[];
  setProvider?: (provider: EthereumProvider) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
