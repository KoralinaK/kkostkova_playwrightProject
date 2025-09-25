import { Page, Locator, expect } from "@playwright/test";
import { DashboardPage } from "./dashboard_page";
import { RegistrationPage } from "./registration_page";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[data-testid="username-input"]');
    this.passwordInput = page.locator('input[data-testid="password-input"]');
    this.loginButton = page.locator('button[data-testid="submit-button"]');
    this.registerButton = page.locator(
      '//button[@data-testid="register-button"]'
    );
  }

  async openLoginPage(): Promise<this> {
    await this.page.goto("/");
    return this;
  }

  async typeUsername(username: string): Promise<this> {
    await this.usernameInput.fill(username);
    return this;
  }

  async typePassword(password: string): Promise<this> {
    await this.passwordInput.fill(password);
    return this;
  }

  async clickOnLogin(): Promise<DashboardPage> {
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
    return new DashboardPage(this.page);
  }

  async login(username: string, password: string): Promise<DashboardPage> {
    //await this.openLoginPage();
    await this.typeUsername(username);
    await this.page.waitForTimeout(600);
    await this.typePassword(password);
    await this.clickOnLogin();
    return new DashboardPage(this.page);
  }
  async clickOnRegister(): Promise<RegistrationPage> {
    await this.registerButton.click();
    return new RegistrationPage(this.page);
  }
}
