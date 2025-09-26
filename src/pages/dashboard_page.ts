import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "./login_page";

export class DashboardPage {
  readonly page: Page;

  // Profil
  readonly profileActionButton: Locator;
  readonly nameInput: Locator;
  readonly surnameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly ageInput: Locator;
  readonly submitButton: Locator;
  readonly profileName: Locator;
  readonly profileSurname: Locator;
  readonly profileEmail: Locator;
  readonly profilePhone: Locator;
  readonly profileAge: Locator;

  // Účty
  readonly accountActionButton: Locator;
  readonly accountNumber: Locator;
  readonly accountBalance: Locator;
  readonly accountType: Locator;

  // Header + menu
  readonly logoutButton: Locator;
  readonly header: Locator;
  readonly logo: Locator;
  readonly appTitle: Locator;
  readonly sidebar: Locator;
  readonly navHome: Locator;
  readonly navAccounts: Locator;
  readonly navTransactions: Locator;
  readonly navSupport: Locator;
  readonly dashboardContent: Locator;
  readonly accountSummary: Locator;

  constructor(page: Page) {
    this.page = page;

    // Profil
    this.profileActionButton = page.locator(
      "//button[@data-testid='toggle-edit-profile-button']"
    );
    this.nameInput = page.locator("input[data-testid='chage-name-input']");
    this.surnameInput = page.locator(
      'input[data-testid="chage-surname-input"]'
    );
    this.emailInput = page.locator("//div[3]//input[1]");
    this.phoneInput = page.locator("input[data-testid='chage-phone-input']");
    this.ageInput = page.locator("input[data-testid='chage-age-input']");
    this.submitButton = page.locator("//button[@type='submit']");
    this.profileName = page.locator("//div[@data-testid='name']");
    this.profileSurname = page.locator("//div[@data-testid='surname']");
    this.profileEmail = page.locator("//div[@data-testid='email']");
    this.profilePhone = page.locator("//div[@data-testid='phone']");
    this.profileAge = page.locator("//div[@data-testid='age']");

    // Účty
    this.accountActionButton = page.locator("button[class='account-action']");
    this.accountNumber = page.locator("td[data-testid='account-number']");
    this.accountBalance = page.locator("td[data-testid='account-balance']");
    this.accountType = page.locator("td[data-testid='account-type']");

    // Header + menu
    this.logoutButton = page.locator("button.logout-link");
    this.header = page.locator("header.dashboard-header");
    this.logo = page.locator('[data-testid="logo-img"]');
    this.appTitle = page.locator(".app-title");
    this.sidebar = page.locator(".dashboard-sidebar");
    this.navHome = page.locator("nav ul li", { hasText: "Domů" });
    this.navAccounts = page.locator("nav ul li", { hasText: "Účty" });
    this.navTransactions = page.locator("nav ul li", { hasText: "Transakce" });
    this.navSupport = page.locator("nav ul li", { hasText: "Podpora" });
    this.dashboardContent = page.locator('[data-testid="dashboard-content"]');
    this.accountSummary = page.locator("//div[@class='account-summary']");
  }

  async openDashboardPage(): Promise<this> {
    await this.page.goto("/dashboard");
    await expect(this.page).toHaveURL(/.*\/dashboard/);
    await this.page.waitForLoadState("load");
    return this;
  }

  // ----- Header a menu -----
  async expectHeaderVisible(): Promise<this> {
    await expect(this.header).toBeVisible();
    await expect(this.logo).toBeVisible();
    await expect(this.appTitle).toHaveText("TEG#B Dashboard");
    await expect(this.logoutButton).toBeVisible();
    await expect(this.logoutButton).toHaveText("Odhlásit se");
    return this;
  }

  async expectMenuVisible(): Promise<this> {
    await expect(this.sidebar).toBeVisible();
    await expect(this.navHome).toBeVisible();
    await expect(this.navHome).toHaveText("Domů");
    await expect(this.navAccounts).toBeVisible();
    await expect(this.navAccounts).toHaveText("Účty");
    await expect(this.navTransactions).toBeVisible();
    await expect(this.navTransactions).toHaveText("Transakce");
    await expect(this.navSupport).toBeVisible();
    await expect(this.navSupport).toHaveText("Podpora");
    return this;
  }

  async goToHome(): Promise<this> {
    await this.navHome.click();
    await expect(this.dashboardContent).toBeVisible();
    return this;
  }

  async goToAccounts(): Promise<this> {
    await this.navAccounts.click();
    await expect(
      this.page.locator('[data-testid="accounts-title"]')
    ).toBeVisible();
    return this;
  }

  // ----- Profil -----
  async clickEditProfile(): Promise<this> {
    await this.profileActionButton.waitFor({ state: "visible" });
    await this.profileActionButton.click();
    await expect(this.profileActionButton).toContainText("Zrušit úpravy");
    return this;
  }

  async fillProfile(
    firstname: string,
    surname: string,
    email: string,
    phone: string,
    age: string
  ): Promise<this> {
    await this.nameInput.click({ clickCount: 3 });
    await this.nameInput.fill(firstname);
    await this.page.keyboard.press("Enter");
    await this.surnameInput.click({ clickCount: 3 });
    await this.surnameInput.fill(surname);
    await this.page.keyboard.press("Enter");
    await this.emailInput.click({ clickCount: 3 });
    await this.emailInput.fill(email);
    await this.page.keyboard.press("Enter");
    await this.phoneInput.click({ clickCount: 3 });
    await this.phoneInput.fill(phone);
    await this.page.keyboard.press("Enter");
    await this.ageInput.click({ clickCount: 3 });
    await this.ageInput.fill(age);
    await this.page.waitForTimeout(500);
    await this.submitButton.click();
    return this;
  }

  async saveProfile(): Promise<this> {
    await this.submitButton.click();
    return this;
  }

  async expectProfileData(
    name: string,
    surname: string,
    email: string,
    phone: string,
    age: string
  ): Promise<this> {
    await expect(this.profileName).toContainText(`Jméno: ${name}`);
    await expect(this.profileSurname).toContainText(`Příjmení: ${surname}`);
    await expect(this.profileEmail).toContainText(`Email: ${email}`);
    await expect(this.profilePhone).toContainText(`Telefon: ${phone}`);
    await expect(this.profileAge).toContainText(`Věk: ${age}`);
    return this;
  }

  // ----- Účty -----
  async expectAccountVisible(): Promise<this> {
    await expect(this.accountNumber).toBeVisible();
    await expect(this.accountBalance).toBeVisible();
    await expect(this.accountType).toBeVisible();
    return this;
  }

  async expectAccountBalance(expectedBalance: number): Promise<this> {
    const text = await this.accountBalance.innerText();
    const numeric = Number(
      text.replace(/[\s\u00A0Kč,]/g, "").replace(",", ".")
    );
    expect(numeric).toBeCloseTo(expectedBalance, 2);
    console.log(`Zůstatek účtu je správně: ${numeric} Kč`);
    return this;
  }

  async clickAccountAction(): Promise<this> {
    await this.accountActionButton.click();
    return this;
  }

  // ----- Logout -----
  async logout(): Promise<LoginPage> {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL("/");
    return new LoginPage(this.page);
  }
  async getAccountBalance(): Promise<number> {
    const text = await this.accountBalance.innerText();
    return Number(text.replace(/\s/g, "").replace("Kč", "").replace(",", "."));
  }
}
