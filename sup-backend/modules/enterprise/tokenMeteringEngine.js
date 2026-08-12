/**
 * Phoenix v18: SaaS B2B Usage-Based Metering & Token Credit Wallet Engine
 * ======================================================================
 * Manages LLM token consumption, credit wallets, plan quotas, and Stripe-ready invoices:
 *  - Tiers: FREE (50k tokens/mo), PRO (1M tokens/mo), ENTERPRISE (Custom)
 *  - Atomic credit deduction with overage protection
 *  - Detailed per-endpoint usage telemetry & cost calculation
 */

const PLAN_LIMITS = {
  FREE: { monthlyTokens: 50000, maxRpm: 15, overageAllowed: false, costPer1kOverageUsd: 0 },
  PRO: { monthlyTokens: 1000000, maxRpm: 60, overageAllowed: true, costPer1kOverageUsd: 0.002 },
  ENTERPRISE: { monthlyTokens: 10000000, maxRpm: 300, overageAllowed: true, costPer1kOverageUsd: 0.0015 }
};

class TokenMeteringEngine {
  constructor() {
    this.wallets = new Map(); // orgId/userId -> { balance, plan, usedThisMonth, lastReset }
  }

  /**
   * Initializes or fetches a user's token wallet.
   */
  getOrCreateWallet(id, plan = 'FREE') {
    const normPlan = PLAN_LIMITS[plan.toUpperCase()] ? plan.toUpperCase() : 'FREE';
    if (!this.wallets.has(id)) {
      this.wallets.set(id, {
        id,
        plan: normPlan,
        quotaMonthlyTokens: PLAN_LIMITS[normPlan].monthlyTokens,
        usedThisMonth: 0,
        overageTokens: 0,
        createdAt: new Date().toISOString()
      });
    }
    return this.wallets.get(id);
  }

  /**
   * Deducts tokens for an AI operation.
   * 
   * @param {Object} params
   * @param {string} params.userId - User or Organization ID
   * @param {number} params.tokens - Tokens consumed by prompt + completion
   * @param {string} params.endpoint - API feature endpoint
   * @returns {Object} Deduction receipt
   */
  deductTokens({ userId, tokens = 100, endpoint = 'general' }) {
    if (!userId) {
      return { success: false, error: 'userId is required for token metering.' };
    }

    const wallet = this.getOrCreateWallet(userId);
    const planConfig = PLAN_LIMITS[wallet.plan];
    const safeTokens = Math.max(1, parseInt(tokens) || 100);

    const remainingQuota = Math.max(0, wallet.quotaMonthlyTokens - wallet.usedThisMonth);

    if (remainingQuota >= safeTokens) {
      wallet.usedThisMonth += safeTokens;
      return {
        success: true,
        userId,
        plan: wallet.plan,
        tokensDeducted: safeTokens,
        endpoint,
        remainingMonthlyQuota: wallet.quotaMonthlyTokens - wallet.usedThisMonth,
        overageChargedUsd: 0,
        status: 'QUOTA_APPROVED'
      };
    }

    // Handle Overage
    if (!planConfig.overageAllowed) {
      return {
        success: false,
        userId,
        plan: wallet.plan,
        error: `Monthly quota of ${wallet.quotaMonthlyTokens.toLocaleString()} tokens exceeded. Upgrade to PRO for auto-scaling overage.`,
        status: 'QUOTA_EXCEEDED'
      };
    }

    const overageAmount = safeTokens - remainingQuota;
    wallet.usedThisMonth = wallet.quotaMonthlyTokens;
    wallet.overageTokens += overageAmount;

    const overageCost = (overageAmount / 1000) * planConfig.costPer1kOverageUsd;

    return {
      success: true,
      userId,
      plan: wallet.plan,
      tokensDeducted: safeTokens,
      endpoint,
      remainingMonthlyQuota: 0,
      overageTokens: wallet.overageTokens,
      overageChargedUsd: Math.round(overageCost * 10000) / 10000,
      status: 'OVERAGE_BILLED'
    };
  }

  /**
   * Generates a monthly usage invoice.
   */
  generateUsageInvoice(userId) {
    const wallet = this.getOrCreateWallet(userId);
    const planConfig = PLAN_LIMITS[wallet.plan];
    const overageCost = (wallet.overageTokens / 1000) * planConfig.costPer1kOverageUsd;

    return {
      success: true,
      userId,
      plan: wallet.plan,
      totalTokensConsumed: wallet.usedThisMonth + wallet.overageTokens,
      monthlyQuota: wallet.quotaMonthlyTokens,
      overageTokens: wallet.overageTokens,
      totalOverageDueUsd: Math.round(overageCost * 100) / 100,
      currency: 'USD',
      billingCycle: new Date().toISOString().substring(0, 7)
    };
  }
}

const defaultMeteringEngine = new TokenMeteringEngine();

module.exports = {
  TokenMeteringEngine,
  defaultMeteringEngine,
  PLAN_LIMITS
};
