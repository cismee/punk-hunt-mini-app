import { base } from 'wagmi/chains';

// Base Mainnet Contract Addresses - UPDATED
export const CONTRACTS = {
  DUCK: '0x72eb385982f00BAD17bCA4b4470dAf10ac4E295D',
  ZAPPER: '0x76A50FD2AB74D498De0fbB4f0aB20654c358bd8E',
  MAIN: '0x14c647Ed6dbF1573f0D1CF32dBdf323dE81cbAc1'
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