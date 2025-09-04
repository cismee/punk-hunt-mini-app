import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, coinbaseWallet, metaMask } from 'wagmi/connectors';

// Enhanced configuration for Base mini-apps
export const config = getDefaultConfig({
  appName: 'Punk Hunt',
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'BASE_HUNT',
  chains: [base, baseSepolia],
  connectors: [
    // Prioritize injected wallet for Base mini-app environment
    injected({
      target: 'metaMask',
    }),
    // Coinbase Wallet integration for Base ecosystem
    coinbaseWallet({
      appName: 'Punk Hunt',
      preference: 'smartWalletOnly', // Use smart wallets when available
    }),
    // Fallback to MetaMask
    metaMask(),
  ],
  ssr: false,
  // Enable auto-connection for better UX in mini-apps
  autoConnect: true,
});

// Base-specific connection helper
export const getPreferredConnector = (connectors) => {
  // In Base mini-app context, prefer injected wallet
  if (typeof window !== 'undefined' && window.ethereum) {
    // Check if we're in a Coinbase Wallet context
    if (window.ethereum.isCoinbaseWallet) {
      return connectors.find(c => c.id === 'coinbaseWalletSDK');
    }
    // Check for MetaMask
    if (window.ethereum.isMetaMask) {
      return connectors.find(c => c.id === 'metaMask');
    }
  }
  
  // Default to first injected connector
  return connectors.find(c => c.id === 'injected') || connectors[0];
};