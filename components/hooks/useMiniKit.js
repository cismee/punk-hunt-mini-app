// hooks/useMiniKit.js - Based on official Base documentation
import { useState, useEffect, useCallback } from 'react';

export function useMiniKit() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if we're in a MiniKit environment
        if (typeof window !== 'undefined' && window.MiniKit) {
          console.log('MiniKit detected');
          
          // According to the docs, check if wallet is already connected
          const isWalletConnected = window.MiniKit.isWalletConnected();
          console.log('Wallet connected status:', isWalletConnected);
          
          if (isWalletConnected) {
            // Get the wallet address
            const walletAddress = window.MiniKit.getWalletAddress();
            console.log('Wallet address:', walletAddress);
            
            if (walletAddress) {
              setAddress(walletAddress);
              setIsConnected(true);
            }
          }
        } else {
          console.log('Not in MiniKit environment');
        }
      } catch (error) {
        console.error('Failed to check MiniKit connection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();

    // Listen for wallet connection changes
    const handleWalletConnect = (walletAddress) => {
      console.log('Wallet connected:', walletAddress);
      setAddress(walletAddress);
      setIsConnected(true);
    };

    const handleWalletDisconnect = () => {
      console.log('Wallet disconnected');
      setAddress(null);
      setIsConnected(false);
    };

    // Add event listeners if MiniKit is available
    if (typeof window !== 'undefined' && window.MiniKit) {
      window.MiniKit.on('wallet:connect', handleWalletConnect);
      window.MiniKit.on('wallet:disconnect', handleWalletDisconnect);

      return () => {
        window.MiniKit.off('wallet:connect', handleWalletConnect);
        window.MiniKit.off('wallet:disconnect', handleWalletDisconnect);
      };
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.MiniKit) {
        throw new Error('MiniKit not available');
      }

      console.log('Requesting wallet connection...');
      
      // Request wallet connection
      const result = await window.MiniKit.requestWallet();
      console.log('Connect wallet result:', result);
      
      if (result.success) {
        setAddress(result.address);
        setIsConnected(true);
        return result.address;
      } else {
        throw new Error(result.error || 'Connection failed');
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
      console.log('Sending transaction:', transactionRequest);
      
      const result = await window.MiniKit.sendTransaction(transactionRequest);
      console.log('Transaction result:', result);
      
      if (result.success) {
        return result.hash;
      } else {
        throw new Error(result.error || 'Transaction failed');
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
      console.log('Signing message:', message);
      
      const result = await window.MiniKit.signMessage({ message });
      console.log('Sign result:', result);
      
      if (result.success) {
        return result.signature;
      } else {
        throw new Error(result.error || 'Signing failed');
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