import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'BaseHunt',
  projectId: 'BASE_HUNT', // Replace with real ID
  chains: [base, baseSepolia],
  ssr: false,
});