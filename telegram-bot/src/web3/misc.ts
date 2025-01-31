import { ethers } from 'ethers';

export function findHash(message: string) {
  const regex = /0x[a-fA-F0-9]{64}/g;
  const match = message.match(regex);
  if (match) {
    return match[0]
  }
  return null
}


export function isValidAddress(address: string) {
  return ethers.isAddress(address);
}