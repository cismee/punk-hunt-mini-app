// hooks/useMiniKit.js - Base Wallet Integration
import { useState, useEffect, useCallback } from 'react';

export function useMiniKit() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize MiniKit connection
  useEffect(() => {
    const initMiniKit = async () => {
      try {
        // Check if we're in a Base mini-app environment
        if (typeof window !== 'undefined' && window.MiniKit) {
          console.log('MiniKit detected in Base app environment');

          // Get current wallet status - Base apps should have wallet automatically available
          const walletResponse = await window.MiniKit.commandsAsync.getWallet();
          
          if (walletResponse.success) {
            setAddress(walletResponse.data.address);
            setIsConnected(true);
            console.log('Connected to Base Wallet:', walletResponse.data.address);
          } else {
            console.log('Wallet available but not connected');
          }
        } else {
          // Not in Base mini-app environment
          console.log('Not in Base mini-app environment - MiniKit not available');
        }
      } catch (error) {
        console.error('Failed to initialize MiniKit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initMiniKit();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (window.MiniKit) {
        const response = await window.MiniKit.commandsAsync.getWallet();
        
        if (response.success) {
          setAddress(response.data.address);
          setIsConnected(true);
          return response.data.address;
        } else {
          throw new Error('Failed to connect wallet');
        }
      } else {
        throw new Error('MiniKit not available');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
  }, []);

  const sendTransaction = useCallback(async (transactionRequest) => {
    if (!window.MiniKit || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await window.MiniKit.commandsAsync.sendTransaction(transactionRequest);
      
      if (response.success) {
        return response.data.hash;
      } else {
        throw new Error(response.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }, [isConnected]);

  const signMessage = useCallback(async (message) => {
    if (!window.MiniKit || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await window.MiniKit.commandsAsync.signMessage({ message });
      
      if (response.success) {
        return response.data.signature;
      } else {
        throw new Error(response.error || 'Signing failed');
      }
    } catch (error) {
      console.error('Message signing failed:', error);
      throw error;
    }
  }, [isConnected]);

  return {
    isConnected,
    address,
    isLoading,
    connectWallet,
    disconnect,
    sendTransaction,
    signMessage
  };
}