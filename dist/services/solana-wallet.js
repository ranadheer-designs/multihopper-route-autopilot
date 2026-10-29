"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaWalletManager = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
class SolanaWalletManager {
    connection;
    keypair;
    constructor(config) {
        this.connection = new web3_js_1.Connection(config.rpcUrl, 'confirmed');
        if (config.privateKey) {
            try {
                const decoded = bs58_1.default.decode(config.privateKey);
                this.keypair = web3_js_1.Keypair.fromSecretKey(decoded);
            }
            catch (err) {
                console.warn('⚠️ Unable to decode SOLANA_PRIVATE_KEY as base58 string; running in view/simulation mode.');
            }
        }
    }
    getPublicKey() {
        return this.keypair?.publicKey;
    }
    getConnection() {
        return this.connection;
    }
    async getBalance() {
        if (!this.keypair) {
            return { sol: 0, lamports: 0 };
        }
        const balanceLamports = await this.connection.getBalance(this.keypair.publicKey);
        return {
            sol: balanceLamports / web3_js_1.LAMPORTS_PER_SOL,
            lamports: balanceLamports,
        };
    }
    async isHealthy() {
        try {
            const version = await this.connection.getVersion();
            return Boolean(version['solana-core']);
        }
        catch {
            return false;
        }
    }
}
exports.SolanaWalletManager = SolanaWalletManager;
//# sourceMappingURL=solana-wallet.js.map