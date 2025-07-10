import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchInput = 'input[type="text"][placeholder*="Search"], input[aria-label*="Search"], #gh-ac';
  readonly searchButton = 'button[type="submit"], input[type="submit"], #gh-btn';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('https://www.ebay.com/');
    // Wait for the page to be ready
    await this.page.waitForSelector(this.searchInput, { timeout: 10000 });
  }

  async searchFor(term: string) {
    await this.page.fill(this.searchInput, term);
    await this.page.click(this.searchButton);
  }
} 