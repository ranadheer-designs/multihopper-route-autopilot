"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTracker = void 0;
class AnalyticsTracker {
    totalVolumeUsd = 0;
    QUALIFICATION_THRESHOLD = 100000; // $100k USD minimum
    recordVolume(amountUsd) {
        this.totalVolumeUsd += amountUsd;
    }
    getProgress() {
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
exports.AnalyticsTracker = AnalyticsTracker;
//# sourceMappingURL=analytics.js.map