export class TestHelpers {
  /**
   * Extract numeric price value from price text
   */
  static extractPriceValue(priceText: string): number {
    const match = priceText.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  }

  /**
   * Check if category matches wallet-related terms
   */
  static isWalletCategory(category: string): boolean {
    const walletTerms = ['wallet', 'leather', 'accessory', 'bag', 'purse', 'card holder', 'bifold', 'trifold'];
    return walletTerms.some(term => category.toLowerCase().includes(term));
  }

  /**
   * Check if price is within range of main price (±10%)
   */
  static isPriceInRange(price: number, mainPrice: number): boolean {
    const lowerBound = mainPrice * 0.9;
    const upperBound = mainPrice * 1.1;
    return price >= lowerBound && price <= upperBound;
  }

  /**
   * Wait for network idle with custom timeout
   */
  static async waitForNetworkIdle(page: any, timeout: number = 10000): Promise<void> {
    try {
      await page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      // Continue if network doesn't become idle within timeout
      console.log('Network did not become idle within timeout, continuing...');
    }
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: any, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  }
}
 