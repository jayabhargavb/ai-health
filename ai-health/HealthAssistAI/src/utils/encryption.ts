// provides encryption and decryption utilities for secure data
import * as Crypto from 'expo-crypto';

// encrypts a string using sha256 (for demonstration, not real encryption)
export async function encrypt(text: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
}

// dummy decrypt function (sha256 is one-way, so just returns input)
export function decrypt(hash: string): string {
  // in real use, use a reversible algorithm
  return hash;
}
