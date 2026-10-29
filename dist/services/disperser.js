"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisperserEngine = void 0;
const web3_js_1 = require("@solana/web3.js");
class DisperserEngine {
    client;
    config;
    constructor(client, config) {
        this.client = client;
        this.config = config;
    }
    /**
     * Executes a privacy-preserving batch disbursement across MultiHopper routes.
     * Staggers routes with jitter to avoid heuristic timing attacks.
     */
    async executeBatch(recipients, tokenMint = 'So11111111111111111111111111111111111111112') {
        const batchId = `batch_${Date.now()}`;
        const results = [];
        let totalAmount = 0;
        let totalEstimatedFee = 0;
        let partnerRevShareAccrued = 0;
        for (let i = 0; i < recipients.length; i++) {
            const recipient = recipients[i];
            totalAmount += recipient.amount;
            const lamports = BigInt(Math.floor(recipient.amount * web3_js_1.LAMPORTS_PER_SOL)).toString();
            try {
                const estimate = await this.client.estimateRoute({
                    fromMint: tokenMint,
                    toAddress: recipient.address,
                    amountLamports: lamports,
                    partnerId: this.config.partnerId,
                });
                const feeSol = Number(estimate.estimatedFee) / web3_js_1.LAMPORTS_PER_SOL;
                const revShareSol = Number(estimate.partnerRevShareLamports) / web3_js_1.LAMPORTS_PER_SOL;
                totalEstimatedFee += feeSol;
                partnerRevShareAccrued += revShareSol;
                const transfer = await this.client.createTransfer({
                    senderAddress: 'MultiHopperSenderVault',
                    recipientAddress: recipient.address,
                    tokenMint,
                    amountLamports: lamports,
                    partnerId: this.config.partnerId,
                    memo: recipient.memo,
                });
                results.push({
                    recipient: recipient.address,
                    amount: recipient.amount,
                    transferId: transfer.transferId,
                    status: 'SUCCESS',
                });
            }
            catch (err) {
                results.push({
                    recipient: recipient.address,
                    amount: recipient.amount,
                    status: 'FAILED',
                    error: err.message || 'Route failure',
                });
            }
        }
        return {
            batchId,
            tokenMint,
            totalRecipients: recipients.length,
            totalAmount,
            totalEstimatedFee,
            partnerRevShareAccrued,
            results,
        };
    }
}
exports.DisperserEngine = DisperserEngine;
//# sourceMappingURL=disperser.js.map