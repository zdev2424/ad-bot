/**
 * Adsgram SDK Adapter for Telegram Mini Apps
 * Handles rewarded video ad playback with automatic fallback simulation in dev/browser mode
 */

const TEST_BLOCK_ID = 'rew-test';

export class AdsgramAdapter {
  constructor(blockId = TEST_BLOCK_ID) {
    this.blockId = blockId;
    this.adController = null;
  }

  /**
   * Initializes the Adsgram controller
   */
  init() {
    if (typeof window !== 'undefined' && window.Adsgram) {
      try {
        this.adController = window.Adsgram.init({
          blockId: this.blockId,
          debug: true
        });
        console.log('📺 [Adsgram] SDK initialized with blockId:', this.blockId);
      } catch (err) {
        console.warn('⚠️ [Adsgram] Init error:', err.message);
      }
    }
  }

  /**
   * Shows a rewarded video ad
   * @returns {Promise<{ success: boolean, method: string }>}
   */
  async showRewardedAd() {
    // If Adsgram is loaded inside Telegram WebApp
    if (this.adController) {
      try {
        const result = await this.adController.show();
        console.log('✅ [Adsgram] Ad completed successfully:', result);
        return { success: true, method: 'adsgram' };
      } catch (err) {
        console.warn('⚠️ [Adsgram] Ad was skipped or failed:', err);
        // If user explicitly closed or failed
        if (err?.error) {
          throw new Error(err.description || 'Ad was skipped before completion');
        }
        throw new Error('Ad playback was interrupted');
      }
    }

    // Dev Fallback Simulation (when running outside Telegram or before Adsgram script loads)
    console.log('ℹ️ [Adsgram] Running simulated rewarded ad (Dev Mode)...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, method: 'simulator' });
      }, 2500);
    });
  }
}

export const adsgramService = new AdsgramAdapter();
