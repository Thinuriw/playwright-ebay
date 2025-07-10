# Playwright eBay UI Automation

This project uses Playwright with the Page Object Model (POM) to automate UI tests for the eBay website, specifically focusing on wallet shopping scenarios with related products functionality and purchase flow automation.

## 🚀 Quick Start

### Clone the Repository

```bash
git clone <repository-url>
cd playwright-ebay
```

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git**

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Verify installation:**
   ```bash
   npx playwright --version
   ```

## 📁 Project Structure

```
playwright-ebay/
├── pages/                                   # Page Object Model classes
│   ├── BasePage.ts                         # Base page object class
│   ├── HomePage.ts                         # eBay homepage with search functionality
│   ├── SearchResultsPage.ts               # Search results page navigation
│   └── ProductPage.ts                     # Product details page with related products
├── tests/                                  # Test specifications
│   ├── ebay-search.spec.ts               # Basic search functionality tests
│   ├── ebay-wallet-related-products.spec.ts # Related products validation tests
│   ├── ebay-wallet-purchase.spec.ts       # Purchase flow automation tests
│   └── ebay-wallet-purchase-focused.spec.ts # Focused purchase scenarios
├── fixtures/                              # Test fixtures and data
│   └── test-fixtures.ts                  # Shared test data and setup
├── support/                               # Utility functions and helpers
│   ├── handleChallenge.ts               # eBay anti-bot challenge handler
│   ├── test-helpers.ts                  # Test-specific helper functions
│   └── utils.ts                         # General utilities
├── screenshots/                          # Test screenshots for debugging
├── playwright-report/                    # HTML test reports
├── test-results/                        # Test execution results
└── playwright.config.ts                 # Playwright configuration
```

## 🧪 Test Scenarios

### 1. Related Products Validation (ebay-wallet-related-products.spec.ts)

Comprehensive tests for eBay's related products functionality:

| Test Case | Description | Validation Points |
|-----------|-------------|-------------------|
| **TC-001** | Section visible, 4 items, correct title | ✅ Related section exists<br>✅ Contains exactly 4 items<br>✅ All items have titles and prices |
| **TC-002** | All items from same category | ✅ Items match wallet/leather category<br>✅ Consistent product types |
| **TC-003** | All items have a price | ✅ Valid price format<br>✅ No missing price data |
| **TC-004** | All items have an image | ✅ Images load correctly<br>✅ Valid image sources |
| **TC-005** | Navigation from related product | ✅ Product links work<br>✅ New page loads correctly |
| **TC-006** | Wishlist icon functionality | ✅ Wishlist interactions work<br>✅ UI state changes |

### 2. Purchase Flow Automation (ebay-wallet-purchase-focused.spec.ts)

Focused scenarios for wallet purchase workflows:

| Scenario | Flow | Key Actions |
|----------|------|-------------|
| **Buy It Now** | Product → Buy It Now → Guest Checkout | ✅ Product selection<br>✅ Buy It Now click<br>✅ Guest checkout option<br>✅ Challenge handling |
| **Add to Cart** | Product → Add to Cart → See in Cart | ✅ Add to cart functionality<br>✅ Cart navigation<br>✅ Item verification<br>✅ Challenge handling |

## 🏃‍♂️ Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test Suite
```bash
# Related products tests
npx playwright test ebay-wallet-related-products.spec.ts

# Purchase flow tests  
npx playwright test ebay-wallet-purchase-focused.spec.ts

# Basic search tests
npx playwright test ebay-search.spec.ts
```

### Run Tests in Different Modes

**Headed Mode (Visual Browser):**
```bash
npx playwright test --headed
```

**UI Mode (Interactive):**
```bash
npx playwright test --ui
```

**Debug Mode:**
```bash
npx playwright test --debug
```

**Specific Browser:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests with Custom Timeout
```bash
npx playwright test --timeout=60000
```

## 📊 Test Reports

### Generate HTML Report
```bash
npx playwright test --reporter=html
```

### View HTML Report
```bash
npx playwright show-report
```

### Other Report Formats
```bash
# Line reporter (minimal output)
npx playwright test --reporter=line

# JSON reporter
npx playwright test --reporter=json

# JUnit reporter (for CI/CD)
npx playwright test --reporter=junit
```

## 🔧 Configuration

### Playwright Configuration (playwright.config.ts)

Key configuration options:
- **Browsers**: Chromium, Firefox, WebKit
- **Timeouts**: 30s default, 15s navigation
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: 1 worker (due to eBay rate limiting)
- **Screenshots**: On failure
- **Videos**: On first retry

### Environment Variables

Create a `.env` file for environment-specific settings:
```bash
BASE_URL=https://www.ebay.com
TIMEOUT=30000
HEADLESS=true
```

## 🛠️ Development

### Page Object Model Structure

The project follows the Page Object Model pattern:

```typescript
// Example: HomePage class
export class HomePage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('https://www.ebay.com/');
  }
  
  async searchFor(query: string): Promise<void> {
    await this.page.getByRole('combobox', { name: 'Search for anything' }).fill(query);
    await this.page.getByRole('combobox', { name: 'Search for anything' }).press('Enter');
  }
}
```

### Adding New Tests

1. Create test file in `tests/` directory
2. Import required page objects
3. Use consistent naming: `test-name.spec.ts`
4. Follow existing patterns for challenge handling

### Anti-Bot Challenge Handling

The project includes robust challenge handling:

```typescript
import { handleChallengeIfPresent } from '../support/handleChallenge';

// Use in tests
await handleChallengeIfPresent(page);
```

## 📸 Screenshots and Debugging

### Automatic Screenshots
- Screenshots are taken on test failures
- Saved to `screenshots/` directory
- Full page screenshots for better debugging

### Manual Screenshots
```typescript
await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
```

### Debug Artifacts
- Error context files in `test-results/`
- Network logs and traces
- Video recordings (on retry)

## 🚨 Known Issues & Limitations

### eBay Anti-Bot Measures
- Tests may encounter challenge pages
- Automatic challenge handling implemented
- Tests skip gracefully when challenges persist

### Rate Limiting
- Parallel execution limited to 1 worker
- Delays between requests implemented
- Cookie clearing between tests

### Network Dependencies
- Tests require internet connection
- eBay site availability affects results
- Network timeouts handled gracefully

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-test`
3. **Follow existing patterns**: Use page objects and consistent naming
4. **Add tests**: Ensure new functionality is tested
5. **Update documentation**: Update README if needed
6. **Submit pull request**: With clear description

### Code Standards
- Use TypeScript for type safety
- Follow existing naming conventions
- Add meaningful comments
- Use async/await consistently
- Handle errors gracefully

## 📋 Troubleshooting

### Common Issues

**Tests timing out:**
```bash
npx playwright test --timeout=60000
```

**Browser not found:**
```bash
npx playwright install
```

**Challenge pages appearing:**
- This is expected behavior
- Tests will skip automatically
- Check console logs for details

**Network errors:**
- Check internet connection
- Verify eBay site accessibility
- Review network logs in test results

### Debug Commands

**List available browsers:**
```bash
npx playwright install --dry-run
```

**Check Playwright version:**
```bash
npx playwright --version
```

**Generate test code:**
```bash
npx playwright codegen ebay.com
```

## 📝 License

This project is for educational and testing purposes. Please ensure compliance with eBay's terms of service when running tests.

## 🔗 Useful Links

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [eBay Developer Program](https://developer.ebay.com/)
- [Playwright Test Runner](https://playwright.dev/docs/intro)