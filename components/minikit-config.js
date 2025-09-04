// minikit-config.js - Replace wagmi-config.js
import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Get the current chain based on environment
export const getCurrentChain = () => {
  // Base mini-apps typically run on mainnet, but check environment
  return process.env.NODE_ENV === 'development' ? baseSepolia : base;
};

export const currentChain = getCurrentChain();

// Create public client for reading blockchain data
export const publicClient = createPublicClient({
  chain: currentChain,
  transport: http()
});

// Export chain info for components
export { base, baseSepolia };