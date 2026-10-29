import { MultiHopperClient } from './multihopper-client.js';
import { DisperseRecipient, DisperseBatchSummary } from '../types/index.js';
import { Config } from '../config/index.js';
export declare class DisperserEngine {
    private client;
    private config;
    constructor(client: MultiHopperClient, config: Config);
    /**
     * Executes a privacy-preserving batch disbursement across MultiHopper routes.
     * Staggers routes with jitter to avoid heuristic timing attacks.
     */
    executeBatch(recipients: DisperseRecipient[], tokenMint?: string): Promise<DisperseBatchSummary>;
}
