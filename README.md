# 🚀 MultiHopper Route Autopilot

**Autonomous Private Payroll Disperser & MCP Routing Engine for Solana** — Built for the [Superteam Earn MultiHopper Build & Route Challenge](https://earn.superteam.fun).

[![Built for MultiHopper](https://img.shields.io/badge/Built%20for-MultiHopper%20Protocol-8A2BE2)](https://multihopper.com)
[![Solana Token-2022](https://img.shields.io/badge/Solana-Token--2022-14F195)](https://solana.com)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Enabled-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## 📖 What Is This?

`multihopper-route-autopilot` is a production-grade CLI application and Model Context Protocol (MCP) server that brings **privacy-preserving, multi-hop asset routing** to Solana payrolls, DAO treasury disbursements, and autonomous AI agents.

### The Problem
On public ledgers like Solana, regular batch disbursements (payroll, bounties, staking rewards) link the organization's primary treasury directly to individual team members and contractors. Anyone tracking on-chain activity can profile contractor earnings, balance histories, and organization burn rates.

### The MultiHopper Solution
Using MultiHopper's decoupled on-chain architecture and Token-2022 permanent delegate extensions:
1. **Decoupled Custody:** Vault locking isolates the sender from intermediate hops.
2. **Timing Jitter:** Staggers multi-hop transfers to defeat heuristic time-correlation analysis.
3. **Automated Revenue Share:** Every routed dollar earns a **0.25% instant fee rebate** to the integrator partner wallet, scaling toward the Superteam Earn $50,000 prize pool.

---

## 🛠️ Key Capabilities

| Capability | Description |
|---|---|
| **Route Estimator** | Calculates intermediate vault hops, execution delays, and the 0.25% partner rebate quote |
| **Batch Disperser** | Disperses payments to dozens of recipient wallets across distinct privacy routes |
| **AI Agent MCP Server** | Exposes MultiHopper routing tools natively to LLM agents (Antigravity, Claude Code, ElizaOS) |
| **Challenge Tracker** | Real-time CLI dashboard measuring volume against the $100,000 Superteam Earn qualification target |

---

## ⚡ Quick Start

### 1. Installation
```bash
git clone https://github.com/your-username/multihopper-route-autopilot.git
cd multihopper-route-autopilot
npm install
npm run build
```

### 2. Configuration
Copy the environment template:
```bash
cp .env.example .env
```
Edit `.env`:
```env
MULTIHOPPER_API_URL=https://api.multihopper.com
MULTIHOPPER_API_KEY=your_multihopper_api_key
MULTIHOPPER_PARTNER_ID=your_partner_referral_id
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your_base58_private_key
ROUTING_JITTER_SECONDS=10
```

---

## 💻 CLI Commands

### 1. Estimate a Route
Inspect the hop sequence, fees, and partner rebate before executing:
```bash
npm start -- estimate 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 5.0
```

### 2. Batch Disperse Payroll
Disperse multi-hop payments defined in a JSON file:
```bash
npm start -- disperse sample-recipients.json
```

### 3. Check Challenge & Rev-Share Progress
Track cumulative volume routed toward the **$100,000 Superteam Earn target**:
```bash
npm start -- challenge
```

---

## 🤖 AI Agent Integration (Model Context Protocol)

Add `multihopper-route-autopilot` to your AI assistant's `mcpServers` configuration:

```json
{
  "mcpServers": {
    "multihopper": {
      "command": "node",
      "args": ["c:/Users/shobh/Downloads/github bounties/multihopper-route-autopilot/dist/mcp/server.js"],
      "env": {
        "MULTIHOPPER_API_KEY": "your_api_key",
        "MULTIHOPPER_PARTNER_ID": "your_partner_id",
        "SOLANA_NETWORK": "devnet"
      }
    }
  }
}
```

Once connected, your AI agents can autonomously:
- Quote private transfers: `multihopper_estimate_route`
- Execute batch payouts: `multihopper_disperse_payroll`
- Monitor challenge qualification: `multihopper_challenge_status`

---

## 📄 License
MIT © Antigravity MultiHopper Builders

