import { test, expect } from "@playwright/test";
import { DashboardPage } from "../../src/pages/dashboard_page";
import { LoginPage } from "../../src/pages/login_page";
import dotenv from "dotenv";
dotenv.config();

test.describe(
  "Atomické testy: Dashboard",
  {
    tag: "@github-actions",
  },
  () => {
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
      const username = process.env.TEGB_USERNAME as string;
      const password = process.env.TEGB_PASSWORD as string;
      const loginPage = new LoginPage(page);
      dashboardPage = await loginPage
        .openLoginPage()
        .then((login) => login.login(username, password));
      //.then((dashboard) => dashboard.openDashboardPage());
    });

    test("Header - logout button visible", async () => {
      await expect.soft(dashboardPage.logoutButton).toBeVisible();
      await expect.soft(dashboardPage.logoutButton).toHaveText("Odhlásit se");
    });

    test("Header elements", async () => {
      await dashboardPage.expectHeaderVisible();
      await dashboardPage.logout();
    });

    test("Left menu", async () => {
      await dashboardPage.expectMenuVisible();
      await dashboardPage.goToAccounts();
      await dashboardPage.goToHome();
    });

    test("Dashboard content", async () => {
      await dashboardPage.expectAccountVisible();
      await dashboardPage.expectHeaderVisible();
      await dashboardPage.expectMenuVisible();
      await dashboardPage.logout();
    });
  }
);
