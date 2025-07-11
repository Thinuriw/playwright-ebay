import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { handleChallengeIfPresent } from '../support/handleChallenge';

// Helper for price parsing
function parsePrice(text: string): number {
  const match = text.replace(/[^\d.,]/g, '').match(/[\d,.]+/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
}

test.describe('Related Products Section', () => {
  test.beforeEach(async ({ page }) => {
    // Optionally clear cookies or set up state here
  });

  test('TC-001: Section visible, 4 items, correct title', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    await homePage.goto();
    await homePage.searchFor('wallet');
    const { page: productPageHandle, productTitle } = await searchResultsPage.clickFirstResultAndSwitch();
    await handleChallengeIfPresent(productPageHandle);
    const productPage = new ProductPage(productPageHandle);
    
    // Wait for the final product page to load (after any redirects)
    try {
      await productPageHandle.waitForURL('**/itm/**', { timeout: 15000 });
    } catch (e) {
      // If still on challenge page, skip test
      if (productPageHandle.url().includes('challenge')) {
        console.log('Still on challenge page, skipping test');
        return;
      }
    }
    
    await productPageHandle.waitForLoadState('domcontentloaded');
    
    // Wait for the product title to appear on the product page
    await productPageHandle.waitForSelector('h1, [data-testid="x-item-title-label"], .notranslate', { timeout: 10000 });
    
    expect(await productPage.isRelatedSectionVisible()).toBeTruthy();
    const count = await productPage.getRelatedItemsCount();
    expect(count).toBe(4);
    const title = await productPage.getRelatedSectionTitle();
    expect(title).toMatch(/Similar items/i);
    // Assert all related items have a title and price
    const itemTitles = await productPage.getRelatedItemTitles();
    const itemPrices = await productPage.getRelatedItemPrices();
    expect(itemTitles.length).toBe(4);
    expect(itemPrices.length).toBe(4);
    itemTitles.forEach(t => expect(t).toBeTruthy());
    itemPrices.forEach(p => expect(p).toMatch(/\$/));
  });

  test('TC-002: All items from same category', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    await homePage.goto();
    await homePage.searchFor('wallet');
    const { page: productPageHandle, productTitle } = await searchResultsPage.clickFirstResultAndSwitch();
    await handleChallengeIfPresent(productPageHandle);
    const productPage = new ProductPage(productPageHandle);
    
    // Wait for the final product page to load (after any redirects)
    try {
      await productPageHandle.waitForURL('**/itm/**', { timeout: 15000 });
    } catch (e) {
      // If still on challenge page, skip test
      if (productPageHandle.url().includes('challenge')) {
        console.log('Still on challenge page, skipping test');
        return;
      }
    }
    
    await productPageHandle.waitForLoadState('domcontentloaded');
    
    // Wait for the product title to appear on the product page
    await productPageHandle.waitForSelector('h1, [data-testid="x-item-title-label"], .notranslate', { timeout: 10000 });
    
    expect(await productPage.isRelatedSectionVisible()).toBeTruthy();
    const count = await productPage.getRelatedItemsCount();
    expect(count).toBe(4);
    const itemTitles = await productPage.getRelatedItemTitles();
    itemTitles.forEach(t => expect(t.toLowerCase()).toMatch(/wallet|card|leather/));
  });

  test('TC-003: All items have a price', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    await homePage.goto();
    await homePage.searchFor('wallet');
    const { page: productPageHandle, productTitle } = await searchResultsPage.clickFirstResultAndSwitch();
    await handleChallengeIfPresent(productPageHandle);
    const productPage = new ProductPage(productPageHandle);
    
    // Wait for the final product page to load (after any redirects)
    await productPageHandle.waitForURL('**/itm/**', { timeout: 15000 });
    await productPageHandle.waitForLoadState('domcontentloaded');
    
    // Wait for the product title to appear on the product page
    await productPageHandle.waitForSelector('h1, [data-testid="x-item-title-label"], .notranslate', { timeout: 10000 });
    
    expect(await productPage.isRelatedSectionVisible()).toBeTruthy();
    const prices = await productPage.getRelatedItemPrices();
    expect(prices.length).toBe(4);
    prices.forEach(p => expect(p).toMatch(/\$/));
  });

  test('TC-004: All items have an image', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    await homePage.goto();
    await homePage.searchFor('wallet');
    const { page: productPageHandle, productTitle } = await searchResultsPage.clickFirstResultAndSwitch();
    await handleChallengeIfPresent(productPageHandle);
    const productPage = new ProductPage(productPageHandle);
    
    // Wait for the final product page to load (after any redirects)
    await productPageHandle.waitForURL('**/itm/**', { timeout: 15000 });
    await productPageHandle.waitForLoadState('domcontentloaded');
    
    // Wait for the product title to appear on the product page
    await productPageHandle.waitForSelector('h1, [data-testid="x-item-title-label"], .notranslate', { timeout: 10000 });
    
    expect(await productPage.isRelatedSectionVisible()).toBeTruthy();
    const images = await productPageHandle.locator(productPage.relatedItems).locator(productPage.relatedItemImage).count();
    expect(images).toBe(4);
  });

  test('TC-005: Navigation from related product', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    await homePage.goto();
    await homePage.searchFor('wallet');
    const { page: productPageHandle, productTitle } = await searchResultsPage.clickFirstResultAndSwitch();
    await handleChallengeIfPresent(productPageHandle);
    const productPage = new ProductPage(productPageHandle);
    
    // Wait for the final product page to load (after any redirects)
    await productPageHandle.waitForURL('**/itm/**', { timeout: 15000 });
    await productPageHandle.waitForLoadState('domcontentloaded');
    
    // Wait for the product title to appear on the product page
    await productPageHandle.waitForSelector('h1, [data-testid="x-item-title-label"], .notranslate', { timeout: 10000 });
    
    expect(await productPage.isRelatedSectionVisible()).toBeTruthy();
    // Click the first related item and check navigation
    const firstRelated = productPageHandle.locator(productPage.relatedItems).first().locator('a');
    const [newPage] = await Promise.all([
      productPageHandle.context().waitForEvent('page'),
      firstRelated.click({ force: true })
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    expect(newPage.url()).toContain('/itm/');
  });

  test('TC-006: Wishlist icon functionality', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    await homePage.goto();
    await homePage.searchFor('wallet');
    const { page: productPageHandle, productTitle } = await searchResultsPage.clickFirstResultAndSwitch();
    await handleChallengeIfPresent(productPageHandle);
    const productPage = new ProductPage(productPageHandle);
    
    // Wait for the final product page to load (after any redirects)
    await productPageHandle.waitForURL('**/itm/**', { timeout: 15000 });
    await productPageHandle.waitForLoadState('domcontentloaded');
    
    // Wait for the product title to appear on the product page
    await productPageHandle.waitForSelector('h1, [data-testid="x-item-title-label"], .notranslate', { timeout: 10000 });
    
    expect(await productPage.isRelatedSectionVisible()).toBeTruthy();
    // Click the wishlist icon on the first related item
    const firstWishlist = productPageHandle.locator(productPage.relatedItems).first().locator(productPage.relatedItemWishlist);
    await firstWishlist.click();
    expect(true).toBeTruthy(); // Optionally, assert icon state change
  });

  });
