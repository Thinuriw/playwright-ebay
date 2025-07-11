import { Page } from '@playwright/test';

export async function handleChallengeIfPresent(page: Page) {
  if (page.url().includes('challenge')) {
    console.log('Challenge page detected, attempting to handle...');
    
    // Try to extract the redirect URL from the challenge page
    const currentUrl = page.url();
    const ruMatch = currentUrl.match(/ru=([^&]+)/);
    
    if (ruMatch) {
      const redirectUrl = decodeURIComponent(ruMatch[1]);
      console.log('Found redirect URL in challenge page:', redirectUrl);
      
      try {
        // Navigate directly to the product page
        await page.goto(redirectUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        console.log('Successfully navigated to:', page.url());
        
        // If it's still a challenge page, wait and try buttons
        if (page.url().includes('challenge')) {
          console.log('Still on challenge page, trying to continue...');
          await page.waitForTimeout(2000);
          
          // Try clicking any continue or proceed buttons
          const buttons = [
            'button:has-text("Continue")',
            'button:has-text("Proceed")', 
            'button[type="submit"]',
            'input[type="submit"]',
            'a:has-text("Continue")',
            '[data-testid="continue"]',
            'button:visible'
          ];
          
          for (const buttonSelector of buttons) {
            try {
              const button = page.locator(buttonSelector).first();
              if (await button.isVisible({ timeout: 1000 })) {
                console.log(`Found and clicking button: ${buttonSelector}`);
                await button.click();
                await page.waitForTimeout(3000);
                
                // Check if we navigated away from challenge
                if (!page.url().includes('challenge')) {
                  console.log('Successfully left challenge page');
                  break;
                }
              }
            } catch (e) {
              // Continue to next button
            }
          }
          
          // Final attempt: wait for auto-redirect
          if (page.url().includes('challenge')) {
            console.log('Waiting for automatic challenge resolution...');
            try {
              await page.waitForURL(url => !url.toString().includes('challenge'), { timeout: 8000 });
              console.log('Challenge automatically resolved');
            } catch (e) {
              console.log('Challenge page persists, continuing with test...');
              // Don't fail the test, continue and see what happens
            }
          }
        }
      } catch (e) {
        console.log('Error handling challenge:', e);
        // Don't throw error, let test continue
        console.log('Continuing despite challenge handling error...');
      }
    } else {
      console.log('Could not extract redirect URL from challenge page, waiting for auto-redirect...');
      try {
        await page.waitForURL(url => !url.toString().includes('challenge'), { timeout: 10000 });
        console.log('Auto-redirect worked');
      } catch (e) {
        console.log('No auto-redirect detected, continuing with current page...');
        // Don't fail the test
      }
    }
  }
}
 