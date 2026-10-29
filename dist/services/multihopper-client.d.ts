import { Config } from '../config/index.js';
import { RouteEstimateRequest, RouteEstimateResponse, CreateTransferRequest, CreateTransferResponse, TransferStatusResponse } from '../types/index.js';
export declare class MultiHopperClient {
    private config;
    constructor(config: Config);
    /**
     * Estimates fees and route structure for a multi-hop transfer.
     * Full-rate transfers incur a 0.5% protocol fee, split 50/50:
     * 0.25% to MultiHopper protocol, and 0.25% to the integrator partner.
     */
    estimateRoute(request: RouteEstimateRequest): Promise<RouteEstimateResponse>;
    /**
     * Creates an authorized multi-hop transfer order.
     * Generates unsigned serialized instructions / transactions via the Orchestrator.
     */
    createTransfer(request: CreateTransferRequest): Promise<CreateTransferResponse>;
    /**
     * Queries transfer status, on-chain execution signatures, and partner rebate tracking.
     */
    getTransferStatus(transferId: string): Promise<TransferStatusResponse>;
}
