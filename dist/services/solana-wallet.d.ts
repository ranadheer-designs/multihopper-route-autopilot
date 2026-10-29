import { Connection, PublicKey } from '@solana/web3.js';
import { Config } from '../config/index.js';
export declare class SolanaWalletManager {
    private connection;
    private keypair?;
    constructor(config: Config);
    getPublicKey(): PublicKey | undefined;
    getConnection(): Connection;
    getBalance(): Promise<{
        sol: number;
        lamports: number;
    }>;
    isHealthy(): Promise<boolean>;
}
