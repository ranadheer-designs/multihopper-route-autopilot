export interface ChallengeProgress {
  routedVolumeUsd: number;
  qualificationThresholdUsd: number;
  progressPercent: number;
  isQualified: boolean;
  totalPartnerRevShareEarnedUsd: number;
  estimatedTierPrizeUsd: number;
  remainingVolumeNeededUsd: number;
}

export class AnalyticsTracker {
  private totalVolumeUsd: number = 0;
  private readonly QUALIFICATION_THRESHOLD = 100000; // $100k USD minimum

  recordVolume(amountUsd: number): void {
    this.totalVolumeUsd += amountUsd;
  }

  getProgress(): ChallengeProgress {
    const isQualified = this.totalVolumeUsd >= this.QUALIFICATION_THRESHOLD;
    const progressPercent = Math.min(100, (this.totalVolumeUsd / this.QUALIFICATION_THRESHOLD) * 100);
    const partnerRevShare = this.totalVolumeUsd * 0.0025; // 0.25%
    const remaining = Math.max(0, this.QUALIFICATION_THRESHOLD - this.totalVolumeUsd);

    // Projected prize based on 1st place share of base pool ($5,000 * 60% = $3,000)
    const estimatedPrize = isQualified ? 3000 : 0;

    return {
      routedVolumeUsd: this.totalVolumeUsd,
      qualificationThresholdUsd: this.QUALIFICATION_THRESHOLD,
      progressPercent,
      isQualified,
      totalPartnerRevShareEarnedUsd: partnerRevShare,
      estimatedTierPrizeUsd: estimatedPrize,
      remainingVolumeNeededUsd: remaining,
    };
  }
}

