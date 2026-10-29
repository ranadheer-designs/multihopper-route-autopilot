"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const configSchema = zod_1.z.object({
    apiUrl: zod_1.z.string().url().default('https://api.multihopper.com'),
    apiKey: zod_1.z.string().default('mh_live_demo_test_key'),
    partnerId: zod_1.z.string().default('antigravity_builder_001'),
    network: zod_1.z.enum(['devnet', 'mainnet-beta', 'testnet']).default('devnet'),
    rpcUrl: zod_1.z.string().url().default('https://api.devnet.solana.com'),
    privateKey: zod_1.z.string().optional(),
    routingJitterSeconds: zod_1.z.coerce.number().default(5),
    // Known Program IDs from MultiHopper Architecture
    coreProgramId: zod_1.z.string().default('3jLoS2wbNgtKzieUUxwg6Xhdv6gbZkHDtPWA9ZAgspFh'),
    orchestratorProgramId: zod_1.z.string().default('4TPCmR2uN3hDM1FbTsf7ZtFXwXGSz4u1Kxv5YHj6eruX'),
});
function loadConfig() {
    return configSchema.parse({
        apiUrl: process.env.MULTIHOPPER_API_URL,
        apiKey: process.env.MULTIHOPPER_API_KEY,
        partnerId: process.env.MULTIHOPPER_PARTNER_ID,
        network: process.env.SOLANA_NETWORK,
        rpcUrl: process.env.SOLANA_RPC_URL,
        privateKey: process.env.SOLANA_PRIVATE_KEY,
        routingJitterSeconds: process.env.ROUTING_JITTER_SECONDS,
    });
}
//# sourceMappingURL=index.js.map