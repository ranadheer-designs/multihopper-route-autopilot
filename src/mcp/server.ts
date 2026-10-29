import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from '../config/index.js';
import { MultiHopperClient } from '../services/multihopper-client.js';
import { DisperserEngine } from '../services/disperser.js';
import { AnalyticsTracker } from '../services/analytics.js';

export function createMultiHopperMcpServer(): Server {
  const config = loadConfig();
  const client = new MultiHopperClient(config);
  const disperser = new DisperserEngine(client, config);
  const tracker = new AnalyticsTracker();

  const server = new Server(
    {
      name: 'multihopper-route-autopilot',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'multihopper_estimate_route',
          description:
            'Estimates multi-hop privacy route, protocol fees, and 0.25% integrator revenue share on Solana.',
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
          description:
            'Disperses batch payments to multiple recipients across decoupled multi-hop routes with timing jitter.',
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
          description:
            'Returns progress toward the $100,000 Superteam Earn Build & Route qualification threshold and earned 0.25% revenue share.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'multihopper_estimate_route') {
      const { toAddress, amountSol, tokenMint } = args as any;
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
      const { recipients } = args as any;
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
  const transport = new StdioServerTransport();
  server.connect(transport).catch(console.error);
}

