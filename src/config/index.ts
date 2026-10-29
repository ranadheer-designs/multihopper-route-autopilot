import dotenv from 'dotenv';
import { z } from 'zod';
import { SolanaNetwork } from '../types/index.js';

dotenv.config();

const configSchema = z.object({
  apiUrl: z.string().url().default('https://api.multihopper.com'),
  apiKey: z.string().default('mh_live_demo_test_key'),
  partnerId: z.string().default('antigravity_builder_001'),
  network: z.enum(['devnet', 'mainnet-beta', 'testnet']).default('devnet'),
  rpcUrl: z.string().url().default('https://api.devnet.solana.com'),
  privateKey: z.string().optional(),
  routingJitterSeconds: z.coerce.number().default(5),
  // Known Program IDs from MultiHopper Architecture
  coreProgramId: z.string().default('3jLoS2wbNgtKzieUUxwg6Xhdv6gbZkHDtPWA9ZAgspFh'),
  orchestratorProgramId: z.string().default('4TPCmR2uN3hDM1FbTsf7ZtFXwXGSz4u1Kxv5YHj6eruX'),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  return configSchema.parse({
    apiUrl: process.env.MULTIHOPPER_API_URL,
    apiKey: process.env.MULTIHOPPER_API_KEY,
    partnerId: process.env.MULTIHOPPER_PARTNER_ID,
    network: process.env.SOLANA_NETWORK as SolanaNetwork,
    rpcUrl: process.env.SOLANA_RPC_URL,
    privateKey: process.env.SOLANA_PRIVATE_KEY,
    routingJitterSeconds: process.env.ROUTING_JITTER_SECONDS,
  });
}

