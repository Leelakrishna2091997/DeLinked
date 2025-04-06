import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async (): Promise<string> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error('Error connecting to MetaMask', error);
    throw new Error('Failed to connect to MetaMask');
  }
};

export const signMessage = async (message: string, address: string): Promise<string> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address]
    });
    
    return signature;
  } catch (error) {
    console.error('Error signing message', error);
    throw new Error('Failed to sign message with MetaMask');
  }
};

export const getEthereumEvents = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  return {
    onAccountsChanged: (callback: (accounts: string[]) => void) => {
      window.ethereum.on('accountsChanged', callback);
    },
    onChainChanged: (callback: (chainId: string) => void) => {
      window.ethereum.on('chainChanged', callback);
    },
    onDisconnect: (callback: () => void) => {
      window.ethereum.on('disconnect', callback);
    }
  };
};