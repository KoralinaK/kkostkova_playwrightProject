import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login_page";
import { RegistrationPage } from "../../src/pages/registration_page";
import { DashboardPage } from "../../src/pages/dashboard_page";
import { fakerCS_CZ as faker } from "@faker-js/faker";
import { UserApi } from "../../src/api/tegb/user_api";
import { AccountApi } from "../../src/api/tegb/account_api";
import checkBalance from "../../src/assets/ddt/check_balance.json";
test.describe("DDT - Kontrola zůstatků účtů", () => {
  checkBalance.forEach((account, index) => {
    test(`${index + 1} DDT: Kontrola účtu se zůstatkem ${
      account.balance
    }`, async ({ page, request }) => {
      const user = {
        username: faker.internet.username(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      const registrationPage = new RegistrationPage(page);
      await registrationPage.openRegistration();
      await registrationPage.fillRegistration(
        user.username,
        user.password,
        user.email
      );
      const userApi = new UserApi(request);
      const accountApi = new AccountApi(request);
      const loginRes = await userApi.loginUser(user.username, user.password);
      const body = await loginRes.json();
      const token = body.access_token;
      const expectedBalance = Number(
        account.balance
          .toString()
          .replace(/\s/g, "")
          .replace("Kč", "")
          .replace(",", ".")
      );
      await accountApi.createAccount(token, expectedBalance, "DDT účet");
      const loginPage = new LoginPage(page);
      await loginPage.login(user.username, user.password);
      const dashboardPage = new DashboardPage(page);
      const frontendBalance = await dashboardPage.getAccountBalance();
      expect(
        frontendBalance,
        `Zůstatek účtu je špatně. Očekáváno: ${expectedBalance}, našel jsem: ${frontendBalance}`
      ).toBeCloseTo(expectedBalance, 2);
    });
  });
});
//Nelze otestovat hodnoty d. + e. (196 000 921 Kč a 298 000 123 Kč) ze zadání, jelikož je nelze uložit do DB - mimo rozsah int v DB.
