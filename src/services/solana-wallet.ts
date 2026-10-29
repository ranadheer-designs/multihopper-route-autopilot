import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';
import { Config } from '../config/index.js';

export class SolanaWalletManager {
  private connection: Connection;
  private keypair?: Keypair;

  constructor(config: Config) {
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    if (config.privateKey) {
      try {
        const decoded = bs58.decode(config.privateKey);
        this.keypair = Keypair.fromSecretKey(decoded);
      } catch (err) {
        console.warn('⚠️ Unable to decode SOLANA_PRIVATE_KEY as base58 string; running in view/simulation mode.');
      }
    }
  }

  getPublicKey(): PublicKey | undefined {
    return this.keypair?.publicKey;
  }

  getConnection(): Connection {
    return this.connection;
  }

  async getBalance(): Promise<{ sol: number; lamports: number }> {
    if (!this.keypair) {
      return { sol: 0, lamports: 0 };
    }
    const balanceLamports = await this.connection.getBalance(this.keypair.publicKey);
    return {
      sol: balanceLamports / LAMPORTS_PER_SOL,
      lamports: balanceLamports,
    };
  }

  async isHealthy(): Promise<boolean> {
    try {
      const version = await this.connection.getVersion();
      return Boolean(version['solana-core']);
    } catch {
      return false;
    }
  }
}

