"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const multihopper_client_js_1 = require("./multihopper-client.js");
const disperser_js_1 = require("./disperser.js");
const analytics_js_1 = require("./analytics.js");
const index_js_1 = require("../config/index.js");
(0, node_test_1.default)('MultiHopperClient: estimates 0.5% fee split evenly into 0.25% rev-share', async () => {
    const config = (0, index_js_1.loadConfig)();
    const client = new multihopper_client_js_1.MultiHopperClient(config);
    const estimate = await client.estimateRoute({
        fromMint: 'So11111111111111111111111111111111111111112',
        toAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        amountLamports: '1000000000', // 1 SOL
        partnerId: 'test_partner',
    });
    node_assert_1.default.strictEqual(estimate.sourceAmount, '1000000000');
    // 0.5% of 1,000,000,000 = 5,000,000 lamports
    node_assert_1.default.strictEqual(estimate.estimatedFee, '5000000');
    // 0.25% rev-share = 2,500,000 lamports
    node_assert_1.default.strictEqual(estimate.partnerRevShareLamports, '2500000');
    node_assert_1.default.strictEqual(estimate.effectiveHops, 3);
});
(0, node_test_1.default)('DisperserEngine: executes multi-recipient batch route with accrued rev-share', async () => {
    const config = (0, index_js_1.loadConfig)();
    const client = new multihopper_client_js_1.MultiHopperClient(config);
    const disperser = new disperser_js_1.DisperserEngine(client, config);
    const recipients = [
        { address: 'Addr111111111111111111111111111111111111111', amount: 2.0 },
        { address: 'Addr222222222222222222222222222222222222222', amount: 3.0 },
    ];
    const summary = await disperser.executeBatch(recipients);
    node_assert_1.default.strictEqual(summary.totalRecipients, 2);
    node_assert_1.default.strictEqual(summary.totalAmount, 5.0);
    node_assert_1.default.strictEqual(summary.results.length, 2);
    node_assert_1.default.strictEqual(summary.results[0].status, 'SUCCESS');
    node_assert_1.default.strictEqual(summary.results[1].status, 'SUCCESS');
    node_assert_1.default.ok(summary.partnerRevShareAccrued > 0);
});
(0, node_test_1.default)('AnalyticsTracker: calculates qualification progress towards $100k target', () => {
    const tracker = new analytics_js_1.AnalyticsTracker();
    tracker.recordVolume(50000); // $50,000 USD
    let p = tracker.getProgress();
    node_assert_1.default.strictEqual(p.progressPercent, 50);
    node_assert_1.default.strictEqual(p.isQualified, false);
    node_assert_1.default.strictEqual(p.totalPartnerRevShareEarnedUsd, 125); // 0.25% of 50k
    tracker.recordVolume(50000); // +$50,000 -> $100,000 USD
    p = tracker.getProgress();
    node_assert_1.default.strictEqual(p.progressPercent, 100);
    node_assert_1.default.strictEqual(p.isQualified, true);
    node_assert_1.default.strictEqual(p.totalPartnerRevShareEarnedUsd, 250); // 0.25% of 100k
    node_assert_1.default.strictEqual(p.estimatedTierPrizeUsd, 3000);
});
//# sourceMappingURL=multihopper.test.js.map