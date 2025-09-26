import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "./login_page";

export class RegistrationPage {
  readonly page: Page;
  readonly getRegisterButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[data-testid="username-input"]');
    this.passwordInput = page.locator('input[data-testid="password-input"]');
    this.emailInput = page.locator('input[data-testid="email-input"]');
    this.getRegisterButton = page.locator(
      'button[data-testid="submit-button"]'
    );
  }

  async openRegistration(): Promise<this> {
    await this.page.goto("/register");
    return this;
  }

  async fillRegistration(
    username: string,
    password: string,
    email: string
  ): Promise<LoginPage> {
    await this.usernameInput.click({ clickCount: 3 });
    await this.usernameInput.fill(username);
    await this.passwordInput.click({ clickCount: 3 });
    await this.passwordInput.fill(password);
    await this.emailInput.click({ clickCount: 3 });
    await this.emailInput.fill(email);
    await expect(this.getRegisterButton).toBeVisible();
    await this.getRegisterButton.click({ clickCount: 3 });
    await this.getRegisterButton.click();
    return new LoginPage(this.page);
  }

  /*
  async clickOnRegisterButton(): Promise<LoginPage> {
    await expect(this.getRegisterButton).toBeVisible();
    await this.getRegisterButton.click();
    return new LoginPage(this.page);
  }
    */
}
