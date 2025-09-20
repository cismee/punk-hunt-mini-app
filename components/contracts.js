import { base } from 'wagmi/chains';

// Base Mainnet Contract Addresses - UPDATED
export const CONTRACTS = {
  DUCK: '0x1D0779d3e6A1444816F92C26b9c93E42184a1543',
  ZAPPER: '0xb35abc08E1b8744E95c932bFf7Ec8CC01c53b049',
  MAIN: '0x81677FD6e7d75352D9ee97Cf05895087B149cFeA'
};

// Full ABI format for wagmi v2
export const MAIN_ABI = [
  {
    "inputs": [{"name": "_amount", "type": "uint256"}],
    "name": "mintDucks",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
  "inputs": [],
  "name": "winner",
  "outputs": [{"name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
  },
  {
    "inputs": [{"name": "_amount", "type": "uint256"}],
    "name": "mintZappers", 
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_amount", "type": "uint256"}],
    "name": "sendZappers",
    "outputs": [],
    "stateMutability": "nonpayable", 
    "type": "function"
  },
  {
    "inputs": [],
    "name": "duckPrice",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "zapperPrice", 
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "huntingSeason",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ducksMinted",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view", 
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ducksRekt",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "zappersMinted", 
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "zappersBurned", 
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "zapCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHunterAddresses",
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHolderAddresses",
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHunterZaps",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHolderDucks",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ducksMintEndTimestamp",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "secondPlace",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "thirdPlace",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "topShooter",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const DUCK_ABI = [
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view", 
    "type": "function"
  }
];

export const ZAPPER_ABI = [
  {
    "inputs": [
      {"name": "account", "type": "address"},
      {"name": "id", "type": "uint256"}
    ],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Base network configuration  
export const BASE_CHAIN = base;