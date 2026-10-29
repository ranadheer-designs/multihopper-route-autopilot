"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMultiHopperMcpServer = createMultiHopperMcpServer;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const index_js_2 = require("../config/index.js");
const multihopper_client_js_1 = require("../services/multihopper-client.js");
const disperser_js_1 = require("../services/disperser.js");
const analytics_js_1 = require("../services/analytics.js");
function createMultiHopperMcpServer() {
    const config = (0, index_js_2.loadConfig)();
    const client = new multihopper_client_js_1.MultiHopperClient(config);
    const disperser = new disperser_js_1.DisperserEngine(client, config);
    const tracker = new analytics_js_1.AnalyticsTracker();
    const server = new index_js_1.Server({
        name: 'multihopper-route-autopilot',
        version: '1.0.0',
    }, {
        capabilities: {
            tools: {},
        },
    });
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'multihopper_estimate_route',
                    description: 'Estimates multi-hop privacy route, protocol fees, and 0.25% integrator revenue share on Solana.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            toAddress: { type: 'string', description: 'Recipient Solana public key' },
                            amountSol: { type: 'number', description: 'Amount in SOL to route' },
                            tokenMint: { type: 'string', description: 'Token mint address (optional, defaults to WSOL)' },
                        },
                        required: ['toAddress', 'amountSol'],
                    },
                },
                {
                    name: 'multihopper_disperse_payroll',
                    description: 'Disperses batch payments to multiple recipients across decoupled multi-hop routes with timing jitter.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            recipients: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        address: { type: 'string' },
                                        amount: { type: 'number' },
                                        memo: { type: 'string' },
                                    },
                                    required: ['address', 'amount'],
                                },
                            },
                        },
                        required: ['recipients'],
                    },
                },
                {
                    name: 'multihopper_challenge_status',
                    description: 'Returns progress toward the $100,000 Superteam Earn Build & Route qualification threshold and earned 0.25% revenue share.',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
            ],
        };
    });
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        if (name === 'multihopper_estimate_route') {
            const { toAddress, amountSol, tokenMint } = args;
            const lamports = BigInt(Math.floor(amountSol * 1e9)).toString();
            const estimate = await client.estimateRoute({
                fromMint: tokenMint || 'So11111111111111111111111111111111111111112',
                toAddress,
                amountLamports: lamports,
                partnerId: config.partnerId,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(estimate, null, 2) }],
            };
        }
        if (name === 'multihopper_disperse_payroll') {
            const { recipients } = args;
            const batch = await disperser.executeBatch(recipients);
            // Record simulated USD volume (assuming $180 per SOL for tracking)
            tracker.recordVolume(batch.totalAmount * 180);
            return {
                content: [{ type: 'text', text: JSON.stringify(batch, null, 2) }],
            };
        }
        if (name === 'multihopper_challenge_status') {
            const progress = tracker.getProgress();
            return {
                content: [{ type: 'text', text: JSON.stringify(progress, null, 2) }],
            };
        }
        throw new Error(`Unknown tool: ${name}`);
    });
    return server;
}
if (process.argv[1]?.endsWith('server.js') || process.argv[1]?.endsWith('server.ts')) {
    const server = createMultiHopperMcpServer();
    const transport = new stdio_js_1.StdioServerTransport();
    server.connect(transport).catch(console.error);
}
//# sourceMappingURL=server.js.map