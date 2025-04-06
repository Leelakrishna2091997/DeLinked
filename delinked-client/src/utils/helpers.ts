/**
 * Truncates an Ethereum address for display
 */
export const truncateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  /**
   * Check if MetaMask is installed
   */
  export const isMetaMaskInstalled = (): boolean => {
    return typeof window !== 'undefined' && Boolean(window.ethereum);
  };
  
  /**
   * Format error message from API
   */
  export const formatErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    
    if (error.response && error.response.data) {
      return error.response.data.message || 'An error occurred';
    }
    
    return error.message || 'An error occurred';
  };