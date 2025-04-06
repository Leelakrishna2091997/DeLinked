import { ethers } from 'ethers';
import crypto from 'crypto';

// Generate a random nonce
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Verify signature
export function verifySignature(address: string, nonce: string, signature: string): boolean {
  try {
    const message = `Login to DeLinked: ${nonce}`;
    const signerAddress = ethers.verifyMessage(message, signature);
    return signerAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}