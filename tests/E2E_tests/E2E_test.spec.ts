import { test, expect } from "@playwright/test";
import { fakerCS_CZ as faker } from "@faker-js/faker";
import { RegistrationPage } from "../../src/pages/registration_page";
import { LoginPage } from "../../src/pages/login_page";
import { DashboardPage } from "../../src/pages/dashboard_page";
import { UserApi } from "../../src/api/tegb/user_api";
import dotenv from "dotenv";
dotenv.config();
import { AccountApi } from "../../src/api/tegb/account_api";

test.describe(
  "E2E: Registration + Account + Profile flow",
  {
    tag: "@github-actions",
  },
  () => {
    test("registration → API create account → login → fill profile → check → logout", async ({
      page,
      request,
    }) => {
      const testUser = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        surName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        age: faker.number.int({ min: 18, max: 99 }).toString(),
      };
      const registrationPage = new RegistrationPage(page);
      const loginPage = new LoginPage(page);
      const dashboard = new DashboardPage(page);
      const apiUser = new UserApi(request);
      const apiAccount = new AccountApi(request);
      const INITIAL_BALANCE = 250000;
      await test.step("1 Registrace uživatele přes UI", async () => {
        await registrationPage.openRegistration();
        await page.waitForLoadState("load");
        await registrationPage.fillRegistration(
          testUser.username,
          testUser.password,
          testUser.email
        );
        await new Promise((r) => setTimeout(r, 500));
      });
      await test.step("2 Vytvoření účtu přes API", async () => {
        const loginResponse = await apiUser.loginUser(
          testUser.username,
          testUser.password
        );
        expect(loginResponse.status(), "Login status po registraci").toBe(201);
        const loginBody = await loginResponse.json();
        const token = loginBody.access_token;
        await apiAccount.createAccount(
          token,
          INITIAL_BALANCE,
          "Testovací účet"
        );
      });
      await test.step("3 Přihlášení přes UI", async () => {
        await loginPage.login(testUser.username, testUser.password);
        await expect(page).toHaveURL(/.*dashboard/);
      });
      await test.step("4 Vyplnění profilu", async () => {
        await expect(page).toHaveURL(/.*dashboard/);
        await page.waitForLoadState("load");
        await dashboard.clickEditProfile();
        await dashboard.fillProfile(
          testUser.firstName,
          testUser.surName,
          testUser.email,
          testUser.phoneNumber,
          testUser.age
        );
        console.log("vyplněný profil:", testUser);
        await page.waitForLoadState("load");
      });
      await test.step("5 Kontrola profilu", async () => {
        await page.waitForLoadState("load");
        await dashboard.expectProfileData(
          testUser.firstName,
          testUser.surName,
          testUser.email,
          testUser.phoneNumber,
          testUser.age
        );
      });
      await test.step("6 Kontrola účtu", async () => {
        await dashboard.expectAccountVisible();
        await dashboard.expectAccountBalance(INITIAL_BALANCE);
      });
      await test.step("7 Odhlášení", async () => {
        await dashboard.logout();
      });
    });
  }
);
