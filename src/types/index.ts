export type SolanaNetwork = 'devnet' | 'mainnet-beta' | 'testnet';

export type TokenSymbol = 'SOL' | 'USDC' | 'USDT' | string;

export interface RouteHop {
  hopIndex: number;
  vaultPda: string;
  delaySeconds: number;
  executionStatus: 'PENDING' | 'EXECUTING' | 'SETTLED' | 'FAILED';
  txSignature?: string;
}

export interface RouteEstimateRequest {
  fromMint: string;
  toAddress: string;
  amountLamports: string;
  maxHops?: number;
  partnerId?: string;
}

export interface RouteEstimateResponse {
  routeId: string;
  sourceAmount: string;
  estimatedFee: string;
  protocolFeeLamports: string;
  partnerRevShareLamports: string;
  effectiveHops: number;
  estimatedDeliverySeconds: number;
  vaultAddresses: string[];
}

export interface CreateTransferRequest {
  senderAddress: string;
  recipientAddress: string;
  tokenMint: string;
  amountLamports: string;
  partnerId?: string;
  hops?: number;
  memo?: string;
}

export interface CreateTransferResponse {
  transferId: string;
  routeId: string;
  unsignedTransactionBase64: string;
  expectedHops: number;
  vaultDepositAddress: string;
  estimatedCompletionTime: string;
}

export interface TransferStatusResponse {
  transferId: string;
  status: 'PENDING_DEPOSIT' | 'ROUTING' | 'COMPLETED' | 'EXPIRED' | 'REFUNDED';
  depositTxSignature?: string;
  finalPayoutTxSignature?: string;
  completedHops: number;
  totalHops: number;
  routedVolumeUsd: number;
  partnerRebatePaidUsd: number;
  timestamp: string;
}

export interface DisperseRecipient {
  address: string;
  amount: number; // in normal human units (e.g. 1.5 SOL or 50 USDC)
  memo?: string;
}

export interface DisperseBatchSummary {
  batchId: string;
  tokenMint: string;
  totalRecipients: number;
  totalAmount: number;
  totalEstimatedFee: number;
  partnerRevShareAccrued: number;
  results: {
    recipient: string;
    amount: number;
    transferId?: string;
    status: 'SUCCESS' | 'FAILED';
    error?: string;
  }[];
}

