// encryption utils
import * as Crypto from 'expo-crypto';

// hash string with sha256
export async function encrypt(text: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
}

// demo decrypt (placeholder)
export function decrypt(hash: string): string {
  // would use proper algo in prod
  return hash;
}
