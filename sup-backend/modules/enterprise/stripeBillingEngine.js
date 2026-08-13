/**
 * Phoenix v20.0: B2B Multi-Tenant SaaS Metering & Stripe Billing Engine
 * 
 * Manages token bucket allowances, metered AI generation quotas,
 * enterprise team seat provisioning, and Stripe subscription webhook lifecycles.
 */

const TIERS = {
  FREE: {
    name: 'Free Community',
    monthlyTokens: 25000,
    maxMockInterviewsPerDay: 3,
    advancedRAG: false,
    teamSeats: 1,
    priceMonthlyUsd: 0
  },
  PRO_DEVELOPER: {
    name: 'Pro Developer Pass',
    monthlyTokens: 500000,
    maxMockInterviewsPerDay: 25,
    advancedRAG: true,
    teamSeats: 1,
    priceMonthlyUsd: 29
  },
  ENTERPRISE_TEAM: {
    name: 'Enterprise University / Team',
    monthlyTokens: 5000000,
    maxMockInterviewsPerDay: 500,
    advancedRAG: true,
    teamSeats: 50,
    priceMonthlyUsd: 499
  }
};

class StripeBillingEngine {
  constructor() {
    this.userAccounts = new Map(); // userId -> accountData
  }

  /**
   * Initializes or fetches an account subscription status.
   * 
   * @param {string} userId - User ID or Organization ID
   * @param {string} tierKey - 'FREE' | 'PRO_DEVELOPER' | 'ENTERPRISE_TEAM'
   */
  getOrCreateAccount(userId, tierKey = 'FREE') {
    if (!this.userAccounts.has(userId)) {
      const tier = TIERS[tierKey] || TIERS.FREE;
      this.userAccounts.set(userId, {
        userId,
        tierKey: tierKey in TIERS ? tierKey : 'FREE',
        tierName: tier.name,
        monthlyQuota: tier.monthlyTokens,
        tokensUsed: 0,
        tokensRemaining: tier.monthlyTokens,
        subscriptionStatus: 'active',
        stripeCustomerId: `cus_${userId.slice(0, 10)}`,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        teamSeatsAllocated: tier.teamSeats,
        teamSeatsUsed: 1
      });
    }
    return this.userAccounts.get(userId);
  }

  /**
   * Deducts tokens from user account quota with atomic rate checking.
   * 
   * @param {string} userId
   * @param {number} tokenCount
   * @returns {Object} Quota deduction result
   */
  deductTokens(userId, tokenCount = 100) {
    const account = this.getOrCreateAccount(userId);

    if (account.tokensRemaining < tokenCount) {
      return {
        allowed: false,
        error: 'MONTHLY_TOKEN_QUOTA_EXCEEDED',
        tokensRemaining: account.tokensRemaining,
        tierKey: account.tierKey,
        upgradeUrl: '/pricing'
      };
    }

    account.tokensUsed += tokenCount;
    account.tokensRemaining -= tokenCount;

    return {
      allowed: true,
      tokensDeducted: tokenCount,
      tokensRemaining: account.tokensRemaining,
      tokensUsed: account.tokensUsed,
      tierKey: account.tierKey
    };
  }

  /**
   * Handles inbound Stripe Webhook events.
   * 
   * @param {Object} event - Stripe Webhook Event payload
   */
  handleStripeWebhook(event = {}) {
    const { type, data } = event;
    const object = data?.object || {};
    const customerId = object.customer;
    const userId = object.metadata?.userId || customerId;

    if (!userId) {
      return { received: true, ignored: true, reason: 'NO_USER_METADATA' };
    }

    const account = this.getOrCreateAccount(userId);

    switch (type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const planId = object.items?.data?.[0]?.plan?.id || object.plan?.id || 'pro';
        const newTier = planId.includes('enterprise') ? 'ENTERPRISE_TEAM' : 'PRO_DEVELOPER';
        account.tierKey = newTier;
        account.tierName = TIERS[newTier].name;
        account.monthlyQuota = TIERS[newTier].monthlyTokens;
        account.tokensRemaining = TIERS[newTier].monthlyTokens - account.tokensUsed;
        account.subscriptionStatus = object.status || 'active';
        account.teamSeatsAllocated = TIERS[newTier].teamSeats;
        return { success: true, action: 'SUBSCRIPTION_UPDATED', newTier, userId };
      }

      case 'customer.subscription.deleted': {
        account.tierKey = 'FREE';
        account.tierName = TIERS.FREE.name;
        account.monthlyQuota = TIERS.FREE.monthlyTokens;
        account.tokensRemaining = Math.max(0, TIERS.FREE.monthlyTokens - account.tokensUsed);
        account.subscriptionStatus = 'canceled';
        account.teamSeatsAllocated = TIERS.FREE.teamSeats;
        return { success: true, action: 'SUBSCRIPTION_CANCELED', newTier: 'FREE', userId };
      }

      case 'invoice.payment_succeeded': {
        // Reset monthly token counter on billing cycle renewal
        account.tokensUsed = 0;
        account.tokensRemaining = account.monthlyQuota;
        return { success: true, action: 'BILLING_CYCLE_RESET', userId };
      }

      default:
        return { received: true, unhandledType: type };
    }
  }
}

const stripeBillingEngine = new StripeBillingEngine();
module.exports = { StripeBillingEngine, stripeBillingEngine, TIERS };
