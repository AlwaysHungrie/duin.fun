export function extractTask(message: string, hash: string, isPrivate: boolean) {
  const messageText = message.substring(isPrivate ? 13 : 6)
  
  // URL regex pattern that includes the hash
  const urlRegex = new RegExp(`https?://[^\\s]*${hash}[^\\s]*`, 'g')
  const urlMatch = messageText.match(urlRegex)
  
  if (urlMatch) {
    // If hash is part of URL, remove the entire URL
    return messageText.replace(urlRegex, '')
  } else {
    // If hash is not in URL, just remove the hash
    const hashRegex = new RegExp(hash, 'g')
    return messageText.replace(hashRegex, '')
  }
}