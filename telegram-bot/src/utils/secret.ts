import crypto from 'crypto'

export function generateSecret(bytes = 33) { // 33 bytes is 264 bits, which is 44 characters
    // Generate cryptographically secure random bytes
    const buffer = crypto.randomBytes(bytes);
    
    // Convert to base64 for string representation
    // URL-safe base64 encoding removes problematic characters
    return buffer.toString('base64url');
}