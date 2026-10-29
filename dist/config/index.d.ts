import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    apiUrl: z.ZodDefault<z.ZodString>;
    apiKey: z.ZodDefault<z.ZodString>;
    partnerId: z.ZodDefault<z.ZodString>;
    network: z.ZodDefault<z.ZodEnum<["devnet", "mainnet-beta", "testnet"]>>;
    rpcUrl: z.ZodDefault<z.ZodString>;
    privateKey: z.ZodOptional<z.ZodString>;
    routingJitterSeconds: z.ZodDefault<z.ZodNumber>;
    coreProgramId: z.ZodDefault<z.ZodString>;
    orchestratorProgramId: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    apiUrl: string;
    apiKey: string;
    partnerId: string;
    network: "devnet" | "mainnet-beta" | "testnet";
    rpcUrl: string;
    routingJitterSeconds: number;
    coreProgramId: string;
    orchestratorProgramId: string;
    privateKey?: string | undefined;
}, {
    apiUrl?: string | undefined;
    apiKey?: string | undefined;
    partnerId?: string | undefined;
    network?: "devnet" | "mainnet-beta" | "testnet" | undefined;
    rpcUrl?: string | undefined;
    privateKey?: string | undefined;
    routingJitterSeconds?: number | undefined;
    coreProgramId?: string | undefined;
    orchestratorProgramId?: string | undefined;
}>;
export type Config = z.infer<typeof configSchema>;
export declare function loadConfig(): Config;
export {};
