
  import { Page } from '@playwright/test';

  export class BasePage {
    protected page: Page;
  
    constructor(page: Page) {
      this.page = page;
    }
  
    // Wait for a selector to be visible (common utility)
    async waitForVisible(selector: string, timeout = 10000) {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
    }
  
    // Take a screenshot with a custom name
    async takeScreenshot(name: string) {
      await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
  
    // Wait for the page to be fully loaded
    async waitForPageReady() {
      await this.page.waitForLoadState('domcontentloaded');
    }
  
    // Get the current page URL
    getUrl(): string {
      return this.page.url();
    }
  
    // Example: Close cookie banner if present
    async closeCookieBannerIfPresent(selector = '.cookie-banner button') {
      if (await this.page.locator(selector).isVisible().catch(() => false)) {
        await this.page.click(selector);
      }
    }
}
 