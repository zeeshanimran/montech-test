import { Injectable, Logger } from '@nestjs/common';
import {
  CipherGCMTypes,
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

export interface SaltPasswordInterface {
  salt: string;
  hash: string;
}

export interface InitVectorEncryptedInterface {
  initVector: string;
  encrypted: string;
}

@Injectable()
/**
 * CryptoService class used for symmetrical encryption and decryption
 */
export class CryptoService {
  private readonly key: Buffer;
  private readonly algorithm: CipherGCMTypes;
  private logger: Logger;
  private saltLength: number;
  private hashIterations: number;

  private CRYPTO_ALGORITHM: any = 'aes-256-ctr';

  /**
   * Contructor, requiere 3 variables on the .env file:
   * CRYPTO_SECURITYKEY = securty key (generate 32 bytes of random data: "crypto.randomBytes(32).toString('base64');")
   * CRYPTO_ALGORITHM = one of CipherGCMTypes algorithms (or run "openssl list -cipher-algorithms" on a cmd)
   * SALT_LENGTH = salt length
   * HASH_ITERATIONS = hash iterations
   */
  constructor() {
    this.logger = new Logger(this.constructor.name);
    this.key = Buffer.from(
      'TZdiQce8iatQsC1oA0sH1y1yXAqtWAq2iKEjCw0RBc4=',
      'base64',
    );
    this.algorithm = this.CRYPTO_ALGORITHM as CipherGCMTypes;
    this.saltLength = Number(16);
    this.hashIterations = Number(1000);
  }

  /**
   * Encrypt the message using cipher algorithm and security key.
   *
   * @param message to encrypt
   * @returns an encrypted message and initial vector
   */
  encrypt(message: any): InitVectorEncryptedInterface {
    try {
      const iv = randomBytes(16).toString('base64'),
        cipher = createCipheriv(
          this.algorithm,
          this.key,
          Buffer.from(iv, 'base64'),
        );
      let encryptedText = cipher.update(
        JSON.stringify(message),
        'utf-8',
        'hex',
      );
      encryptedText += cipher.final('hex');
      return { encrypted: encryptedText, initVector: iv };
    } catch (e) {
      this.logger.error(`There was an error encrypting ${message}`, e);
      return null;
    }
  }

  /**
   * Decrypt the message using cipher algorithm, security key and initial vector.
   *
   * @param message to decrypt
   * @returns an decrypted message
   */
  decrypt(message: InitVectorEncryptedInterface): string {
    try {
      const decipher = createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(message.initVector, 'base64'),
      );
      let decryptedData = decipher.update(message.encrypted, 'hex', 'utf-8');
      decryptedData += decipher.final('utf8');
      return JSON.parse(decryptedData);
    } catch (e) {
      this.logger.error(`There was an error dencrypting ${message}`, e);
      return null;
    }
  }

  /**
   * Create salt and hash from the user password
   *
   * @param password
   */
  hashPassword(password: string): SaltPasswordInterface {
    // Creating a unique salt for a particular user
    const salt = randomBytes(this.saltLength).toString('hex'),
      // Hashing user's salt and password with 1000 iterations,
      hash = pbkdf2Sync(
        password,
        salt,
        this.hashIterations,
        64,
        `sha512`,
      ).toString(`hex`);
    return { hash, salt };
  }

  /**
   * Validate password against store salted and hashed user password
   *
   * @param userPassword
   * @param storedPassword
   */
  validatePassword(
    userPassword: string,
    storedPassword: SaltPasswordInterface,
  ) {
    const hash = pbkdf2Sync(
      userPassword,
      storedPassword.salt,
      this.hashIterations,
      64,
      `sha512`,
    ).toString(`hex`);
    return hash === storedPassword.hash;
  }
}
