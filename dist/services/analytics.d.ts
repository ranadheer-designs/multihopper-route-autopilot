export interface ChallengeProgress {
    routedVolumeUsd: number;
    qualificationThresholdUsd: number;
    progressPercent: number;
    isQualified: boolean;
    totalPartnerRevShareEarnedUsd: number;
    estimatedTierPrizeUsd: number;
    remainingVolumeNeededUsd: number;
}
export declare class AnalyticsTracker {
    private totalVolumeUsd;
    private readonly QUALIFICATION_THRESHOLD;
    recordVolume(amountUsd: number): void;
    getProgress(): ChallengeProgress;
}
