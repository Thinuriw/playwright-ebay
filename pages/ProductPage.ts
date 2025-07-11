import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // Robust selectors for the Related/Similar Products section
  readonly relatedSection = 'h2.EF85:has-text("Similar items")';
  readonly relatedSectionTitle = 'h2.EF85:has-text("Similar items")';
  readonly relatedItems = 'div.hVQz.Cssx div.Mgpb.rgAU';
  readonly relatedItemTitle = 'h3._6rYN.kES0';
  readonly relatedItemPrice = 'div.lOg1 span[role="text"]';
  readonly relatedItemCategory = '.s-item__subtitle, .s-item__category';
  readonly relatedItemImage = 'img.pGa-';
  readonly relatedItemWishlist = 'button[aria-label*="Add"]';
  readonly seeAllLink = 'a:has-text("See all")';

  // Purchase action selectors
  readonly addToCartButton = '[data-testid="x-atc-action"] [data-testid="ux-call-to-action"]';
  readonly buyItNowButton = 'a:has-text("Buy It Now"), button:has-text("Buy It Now")';
  readonly seeInCartLink = 'a[role="link"]:has-text("See in cart")';
  readonly checkoutButton = 'button:has-text("Go to checkout"), a:has-text("Go to checkout"), button:has-text("Checkout")';

  async isRelatedSectionVisible() {
    // Scroll to the "Similar items" section specifically
    const relatedSection = this.page.locator(this.relatedSection);
    await relatedSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
    
    return await relatedSection.isVisible();
  }

  async getRelatedSectionTitle() {
    return this.page.locator(this.relatedSectionTitle).textContent();
  }

  async getRelatedItemsCount() {
    return this.page.locator(this.relatedItems).count();
  }

  async getRelatedItemTitles() {
    return this.page.locator(this.relatedItems).locator(this.relatedItemTitle).allTextContents();
  }

  async getRelatedItemPrices() {
    return this.page.locator(this.relatedItems).locator(this.relatedItemPrice).allTextContents();
  }

  async getRelatedItemCategories() {
    return this.page.locator(this.relatedItems).locator(this.relatedItemCategory).allTextContents();
  }

  async clickFirstRelatedItem() {
    await this.page.locator(this.relatedItems).first().locator(this.relatedItemImage).click();
  }

  async clickSeeAll() {
    await this.page.locator(this.seeAllLink).click();
  }

  async clickWishlistOnFirstRelatedItem() {
    await this.page.locator(this.relatedItems).first().locator(this.relatedItemWishlist).click();
  }

  async clickAddToCart() {
    try {
      // Primary selector from Playwright inspector
      await this.page.getByTestId('x-atc-action').getByTestId('ux-call-to-action').click();
      console.log('Successfully clicked Add to cart');
      return true;
    } catch (e) {
      console.log('Primary add to cart selector failed, trying fallback');
      
      // Fallback selectors
      const fallbackSelectors = [
        '[data-testid="atc-btn"]',
        'a:has-text("Add to cart")',
        'button:has-text("Add to cart")'
      ];
      
      for (const selector of fallbackSelectors) {
        try {
          const element = this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 })) {
            await element.click();
            console.log(`Add to cart clicked with fallback selector: ${selector}`);
            return true;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      console.log('Add to cart button not found');
      return false;
    }
  }

  async clickSeeInCart() {
    try {
      await this.page.getByRole('link', { name: 'See in cart' }).click();
      console.log('Successfully clicked See in cart');
      return true;
    } catch (e) {
      console.log('See in cart link not found');
      return false;
    }
  }

  async clickBuyItNow() {
    try {
      await this.page.getByRole('link', { name: 'Buy It Now' }).click();
      console.log('Successfully clicked Buy It Now');
      return true;
    } catch (e) {
      console.log('Buy It Now button not found');
      return false;
    }
  }

  async isItemAvailable(): Promise<boolean> {
    const soldOutIndicators = [
      ':has-text("Sold")',
      ':has-text("Ended")',
      ':has-text("Not available")',
      '.sold-out'
    ];
    
    for (const indicator of soldOutIndicators) {
      if (await this.page.locator(indicator).isVisible()) {
        console.log('Item appears to be sold out or unavailable');
        return false;
      }
    }
    return true;
  }
}
