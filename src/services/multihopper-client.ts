import { Config } from '../config/index.js';
import {
  RouteEstimateRequest,
  RouteEstimateResponse,
  CreateTransferRequest,
  CreateTransferResponse,
  TransferStatusResponse,
} from '../types/index.js';

export class MultiHopperClient {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Estimates fees and route structure for a multi-hop transfer.
   * Full-rate transfers incur a 0.5% protocol fee, split 50/50:
   * 0.25% to MultiHopper protocol, and 0.25% to the integrator partner.
   */
  async estimateRoute(request: RouteEstimateRequest): Promise<RouteEstimateResponse> {
    const amount = BigInt(request.amountLamports);
    // 0.5% total fee = amount * 50 / 10000
    const totalFee = (amount * 50n) / 10000n;
    // 0.25% partner rev-share = totalFee / 2
    const partnerRevShare = totalFee / 2n;
    const protocolFee = totalFee - partnerRevShare;
    const hops = request.maxHops || 3;

    // Build mock or live route estimation
    return {
      routeId: `route_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      sourceAmount: request.amountLamports,
      estimatedFee: totalFee.toString(),
      protocolFeeLamports: protocolFee.toString(),
      partnerRevShareLamports: partnerRevShare.toString(),
      effectiveHops: hops,
      estimatedDeliverySeconds: hops * 12,
      vaultAddresses: Array.from({ length: hops }).map(
        (_, i) => `HopVault${i + 1}_${this.config.coreProgramId.substring(0, 8)}...`
      ),
    };
  }

  /**
   * Creates an authorized multi-hop transfer order.
   * Generates unsigned serialized instructions / transactions via the Orchestrator.
   */
  async createTransfer(request: CreateTransferRequest): Promise<CreateTransferResponse> {
    const transferId = `mh_tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const hops = request.hops || 3;

    return {
      transferId,
      routeId: `route_${transferId}`,
      unsignedTransactionBase64: 'BASE64_SIMULATED_TRANSACTION_PAYLOAD',
      expectedHops: hops,
      vaultDepositAddress: `${this.config.coreProgramId.substring(0, 16)}Vault`,
      estimatedCompletionTime: new Date(Date.now() + hops * 12 * 1000).toISOString(),
    };
  }

  /**
   * Queries transfer status, on-chain execution signatures, and partner rebate tracking.
   */
  async getTransferStatus(transferId: string): Promise<TransferStatusResponse> {
    return {
      transferId,
      status: 'COMPLETED',
      completedHops: 3,
      totalHops: 3,
      depositTxSignature: `5xSimDepositSig_${transferId}`,
      finalPayoutTxSignature: `3ySimPayoutSig_${transferId}`,
      routedVolumeUsd: 1500.0,
      partnerRebatePaidUsd: 3.75, // 0.25% of $1500
      timestamp: new Date().toISOString(),
    };
  }
}

