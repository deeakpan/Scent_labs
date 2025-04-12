import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const baseSepoliaChain = {
  ...baseSepolia,
  iconUrl: 'https://raw.githubusercontent.com/base-org/brand-kit/001c0e9b40a67799ebe0418671ac4e02a0c683ce/logo/in-use/icon/base-logo.svg',
  iconBackground: '#0052FF',
};

// Configure chains & providers with RainbowKit
export const config = getDefaultConfig({
  appName: 'ScentLabs',
  projectId: 'f2eaebf9638d95f99e0c87d2b3aa051d',
  chains: [baseSepoliaChain],
  initialChain: baseSepoliaChain,
  ssr: false, // Required for proper client-side rendering
});

export const WalletProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        showRecentTransactions={true}
        chains={[baseSepoliaChain]}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};