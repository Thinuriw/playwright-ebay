import { Page, BrowserContext } from '@playwright/test';
import { BasePage } from './BasePage';
import { handleChallengeIfPresent } from '../support/handleChallenge';

export class SearchResultsPage extends BasePage {
  readonly resultTitles = '.s-item__title, [data-testid="item-title"], .srp-results .s-item__title';
  readonly firstResultLink = 'a[href*="/itm/"]:not([aria-hidden="true"]), .s-item__link:not([aria-hidden="true"]), .s-item__title a:not([aria-hidden="true"])';
  readonly firstResultImage = '.s-item__image-section img:not([alt*="Shop on eBay"]), .s-item__image-wrapper img:not([alt*="Shop on eBay"]), .s-item__image img';
  readonly firstResultCard = '.s-item';

  constructor(page: Page) {
    super(page);
  }

  async getResultTitles(): Promise<string[]> {
    await this.page.waitForSelector(this.resultTitles, { timeout: 10000 });
    return this.page.$$eval(this.resultTitles, elements => elements.map(e => e.textContent || ''));
  }

  async clickFirstResult(): Promise<void> {
    // Click the first product link in the same tab
    const firstLink = this.page.locator(this.firstResultLink).first();
    await firstLink.scrollIntoViewIfNeeded();
    await firstLink.waitFor({ state: 'visible' });
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      firstLink.click({ force: true })
    ]);
  }

  async clickFirstResultAndGetNewPage(context: BrowserContext): Promise<Page> {
    // Try clicking the product image first
    const firstImage = this.page.locator(this.firstResultImage).first();
    await firstImage.scrollIntoViewIfNeeded();
    await firstImage.waitFor({ state: 'visible' });
    try {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        firstImage.click({ force: true })
      ]);
      await newPage.waitForLoadState('domcontentloaded');
      return newPage;
    } catch (e) {}

    // Try clicking the product card
    const firstCard = this.page.locator(this.firstResultCard).first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.waitFor({ state: 'visible' });
    try {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        firstCard.click({ force: true })
      ]);
      await newPage.waitForLoadState('domcontentloaded');
      return newPage;
    } catch (e) {}

    // Fallback: Try clicking the link with force
    const firstLink = this.page.locator(this.firstResultLink).first();
    await firstLink.scrollIntoViewIfNeeded();
    await firstLink.waitFor({ state: 'visible' });
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      firstLink.click({ force: true })
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  async getFirstProductTitle(): Promise<string> {
    await this.page.waitForSelector('.s-item a[href*="/itm/"]:not([aria-hidden="true"]):not(:has-text("Shop on eBay"))', { timeout: 10000 });
    const firstProductLink = this.page.locator('.s-item a[href*="/itm/"]:not([aria-hidden="true"]):not(:has-text("Shop on eBay"))').first();
    return await firstProductLink.textContent() || '';
  }

  async clickFirstResultAndSwitch(): Promise<{ page: Page; productTitle: string }> {
    await this.page.waitForSelector('.s-item a[href*="/itm/"]:not([aria-hidden="true"]):not(:has-text("Shop on eBay"))', { timeout: 10000 });
    const firstProductLink = this.page.locator('.s-item a[href*="/itm/"]:not([aria-hidden="true"]):not(:has-text("Shop on eBay"))').first();
    await firstProductLink.scrollIntoViewIfNeeded();
    await firstProductLink.waitFor({ state: 'visible' });

    // Get product title before clicking
    const productTitle = await firstProductLink.textContent() || '';

    // Log attributes for debugging
    console.log('First product link href:', await firstProductLink.getAttribute('href'));
    console.log('First product link target:', await firstProductLink.getAttribute('target'));
    console.log('First product link visible:', await firstProductLink.isVisible());
    console.log('First product link text:', productTitle);

    let newPage: Page | null = null;
    const context = this.page.context();
    let clickError: any = null;

    // Try normal click first
    try {
      const [openedPage] = await Promise.all([
        context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
        firstProductLink.click({ force: true })
      ]);
      if (openedPage) {
        newPage = openedPage;
      }
    } catch (e) {
      clickError = e;
    }

    // If no new page, try middle mouse button click
    if (!newPage) {
      try {
        const [openedPage] = await Promise.all([
          context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
          firstProductLink.click({ button: 'middle', force: true })
        ]);
        if (openedPage) {
          newPage = openedPage;
        }
      } catch (e) {
        clickError = e;
      }
    }

    // If still no new page, fall back to same tab navigation
    if (!newPage) {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        firstProductLink.click({ force: true })
      ]);
      return { page: this.page, productTitle };
    } else {
      // Wait for the new page to load
      try {
        await newPage.waitForLoadState('domcontentloaded');
        console.log('New page URL:', newPage.url());
        
        // Check if it's a product page (could be redirected)
        if (!newPage.url().includes('/itm/') && !newPage.url().includes('ebay.com')) {
          throw new Error(`Did not land on eBay product page. URL: ${newPage.url()}`);
        }
        
        // If it's not directly an item page, wait for redirect
        if (!newPage.url().includes('/itm/')) {
          try {
            await newPage.waitForURL('**/itm/**', { timeout: 10000 });
          } catch (e) {
            console.log('Waiting for product page redirect failed, checking current URL:', newPage.url());
            // Allow if it's still on eBay domain
            if (!newPage.url().includes('ebay.com')) {
              throw new Error(`Did not land on eBay product page. URL: ${newPage.url()}`);
            }
          }
        }
      } catch (e) {
        console.log('Error waiting for page load:', e);
        // Still return the page if we have it
        if (newPage.url().includes('ebay.com')) {
          console.log('Continuing with eBay page despite load error');
        } else {
          throw e;
        }
      }
      
      return { page: newPage, productTitle };
    }
  }
} 
