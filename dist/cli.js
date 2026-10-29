#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const index_js_1 = require("./config/index.js");
const multihopper_client_js_1 = require("./services/multihopper-client.js");
const disperser_js_1 = require("./services/disperser.js");
const analytics_js_1 = require("./services/analytics.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const server_js_1 = require("./mcp/server.js");
const program = new commander_1.Command();
const config = (0, index_js_1.loadConfig)();
const client = new multihopper_client_js_1.MultiHopperClient(config);
const disperser = new disperser_js_1.DisperserEngine(client, config);
const tracker = new analytics_js_1.AnalyticsTracker();
program
    .name('multihopper')
    .description('Autonomous Private Payroll Disperser & MCP Routing Engine for Solana using MultiHopper Protocol')
    .version('1.0.0');
program
    .command('estimate')
    .description('Estimate routing hops, protocol fees, and 0.25% revenue share')
    .argument('<recipient>', 'Recipient Solana address')
    .argument('<amount>', 'Amount in SOL')
    .action(async (recipient, amountStr) => {
    const amountSol = parseFloat(amountStr);
    const lamports = BigInt(Math.floor(amountSol * 1e9)).toString();
    console.log(`\n🔍 Calculating MultiHopper route for ${amountSol} SOL to ${recipient}...`);
    const res = await client.estimateRoute({
        fromMint: 'So11111111111111111111111111111111111111112',
        toAddress: recipient,
        amountLamports: lamports,
        partnerId: config.partnerId,
    });
    console.log('\n✅ Route Quote Prepared:');
    console.log(`   • Route ID:                ${res.routeId}`);
    console.log(`   • Hops Count:              ${res.effectiveHops} hops`);
    console.log(`   • Est. Delivery Time:      ${res.estimatedDeliverySeconds}s`);
    console.log(`   • Protocol Fee:            ${Number(res.protocolFeeLamports) / 1e9} SOL`);
    console.log(`   • Your 0.25% Rev-Share:    ${Number(res.partnerRevShareLamports) / 1e9} SOL (Instant Rebate)`);
    console.log(`   • Intermediate Vaults:     ${res.vaultAddresses.join(' -> ')}\n`);
});
program
    .command('disperse')
    .description('Batch disperse funds to multiple recipients across decoupled multi-hop routes')
    .argument('<file>', 'Path to JSON file containing array of { address, amount, memo? }')
    .action(async (filePath) => {
    if (!fs_1.default.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }
    const recipients = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    console.log(`\n🚀 Dispersing ${recipients.length} payments via MultiHopper with timing jitter...`);
    const summary = await disperser.executeBatch(recipients);
    console.log('\n📊 Batch Run Summary:');
    console.log(`   • Batch ID:             ${summary.batchId}`);
    console.log(`   • Total Recipients:     ${summary.totalRecipients}`);
    console.log(`   • Total Routed Amount:  ${summary.totalAmount} SOL`);
    console.log(`   • Total Fees Paid:      ${summary.totalEstimatedFee.toFixed(6)} SOL`);
    console.log(`   • Partner Rev-Share:    +${summary.partnerRevShareAccrued.toFixed(6)} SOL`);
    console.log('\n📋 Recipient Breakdown:');
    summary.results.forEach((r, idx) => {
        console.log(`   ${idx + 1}. [${r.status}] ${r.recipient} : ${r.amount} SOL (${r.transferId || r.error})`);
    });
    console.log('');
});
program
    .command('challenge')
    .description('View Superteam Earn Build & Route Challenge progress ($100k target)')
    .action(() => {
    // Seed sample volume for dashboard demo
    tracker.recordVolume(12450);
    const p = tracker.getProgress();
    console.log('\n🏆 Superteam Earn: MultiHopper Build & Route Challenge Status');
    console.log('===============================================================');
    console.log(`   • Target Threshold:       $${p.qualificationThresholdUsd.toLocaleString()} USD`);
    console.log(`   • Routed Volume:          $${p.routedVolumeUsd.toLocaleString()} USD`);
    console.log(`   • Progress:               ${p.progressPercent.toFixed(1)}%`);
    console.log(`   • Remaining to Qualify:   $${p.remainingVolumeNeededUsd.toLocaleString()} USD`);
    console.log(`   • 0.25% Rev-Share Earned: $${p.totalPartnerRevShareEarnedUsd.toFixed(2)} USD (Guaranteed)`);
    console.log(`   • Estimated Prize:        $${p.estimatedTierPrizeUsd.toLocaleString()} USD (Tier 1 estimate)`);
    console.log(`   • Qualified Status:       ${p.isQualified ? '✅ QUALIFIED' : '⏳ IN PROGRESS'}\n`);
});
program
    .command('mcp')
    .description('Run MultiHopper Model Context Protocol (MCP) server over stdio for AI Agents')
    .action(async () => {
    const server = (0, server_js_1.createMultiHopperMcpServer)();
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map