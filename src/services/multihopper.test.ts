import test from 'node:test';
import assert from 'node:assert';
import { MultiHopperClient } from './multihopper-client.js';
import { DisperserEngine } from './disperser.js';
import { AnalyticsTracker } from './analytics.js';
import { loadConfig } from '../config/index.js';

test('MultiHopperClient: estimates 0.5% fee split evenly into 0.25% rev-share', async () => {
  const config = loadConfig();
  const client = new MultiHopperClient(config);

  const estimate = await client.estimateRoute({
    fromMint: 'So11111111111111111111111111111111111111112',
    toAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    amountLamports: '1000000000', // 1 SOL
    partnerId: 'test_partner',
  });

  assert.strictEqual(estimate.sourceAmount, '1000000000');
  // 0.5% of 1,000,000,000 = 5,000,000 lamports
  assert.strictEqual(estimate.estimatedFee, '5000000');
  // 0.25% rev-share = 2,500,000 lamports
  assert.strictEqual(estimate.partnerRevShareLamports, '2500000');
  assert.strictEqual(estimate.effectiveHops, 3);
});

test('DisperserEngine: executes multi-recipient batch route with accrued rev-share', async () => {
  const config = loadConfig();
  const client = new MultiHopperClient(config);
  const disperser = new DisperserEngine(client, config);

  const recipients = [
    { address: 'Addr111111111111111111111111111111111111111', amount: 2.0 },
    { address: 'Addr222222222222222222222222222222222222222', amount: 3.0 },
  ];

  const summary = await disperser.executeBatch(recipients);

  assert.strictEqual(summary.totalRecipients, 2);
  assert.strictEqual(summary.totalAmount, 5.0);
  assert.strictEqual(summary.results.length, 2);
  assert.strictEqual(summary.results[0].status, 'SUCCESS');
  assert.strictEqual(summary.results[1].status, 'SUCCESS');
  assert.ok(summary.partnerRevShareAccrued > 0);
});

test('AnalyticsTracker: calculates qualification progress towards $100k target', () => {
  const tracker = new AnalyticsTracker();

  tracker.recordVolume(50000); // $50,000 USD
  let p = tracker.getProgress();
  assert.strictEqual(p.progressPercent, 50);
  assert.strictEqual(p.isQualified, false);
  assert.strictEqual(p.totalPartnerRevShareEarnedUsd, 125); // 0.25% of 50k

  tracker.recordVolume(50000); // +$50,000 -> $100,000 USD
  p = tracker.getProgress();
  assert.strictEqual(p.progressPercent, 100);
  assert.strictEqual(p.isQualified, true);
  assert.strictEqual(p.totalPartnerRevShareEarnedUsd, 250); // 0.25% of 100k
  assert.strictEqual(p.estimatedTierPrizeUsd, 3000);
});

