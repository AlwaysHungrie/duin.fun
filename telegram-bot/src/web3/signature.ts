import { ethers } from "ethers"

export const verifySignature = (text: string, signature: string, address: string) => {
  try {
    const recoveredAddress = ethers.verifyMessage(text, signature)
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch (error) {
    console.error('Error verifying signature', error)
    return false
  }
}
