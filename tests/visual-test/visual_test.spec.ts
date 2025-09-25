import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../../src/pages/registration_page";
import { DashboardPage } from "../../src/pages/dashboard_page";
import { faker } from "@faker-js/faker";

test.describe(
  "Visual Tests - Profile",
  {
    tag: "@github-actions",
  },
  () => {
    let dashboard: DashboardPage;
    let firstName: string;
    let lastName: string;
    let email: string;
    let phone: string;
    let age: string;
    test.beforeEach(async ({ page }) => {
      const registrationPage = new RegistrationPage(page);
      // generování testovacího uživatele
      const username = faker.internet.userName().toLowerCase();
      const password = faker.internet.password();
      email = faker.internet.email();
      firstName = faker.person.firstName();
      lastName = faker.person.lastName();
      phone = "+420 " + faker.phone.number("+420 ### ### ###");
      age = faker.number.int({ min: 18, max: 80 }).toString();
      // registrace a login
      const loginPage = await registrationPage
        .openRegistration()
        .then((rp) => rp.fillRegistration(username, password, email));
      dashboard = await loginPage
        .login(username, password)
        .then(() => new DashboardPage(page));
      await expect(page).toHaveURL(/.*dashboard/);
      await page.waitForLoadState("load");
      // vyplnění profilu
      await dashboard.clickEditProfile();
      await dashboard.fillProfile(firstName, lastName, email, phone, age);
      await dashboard.expectProfileData(firstName, lastName, email, phone, age);
    });
    test("Profile Visual Test", async () => {
      // cílíme na blok s profilem
      const profileSection = dashboard.page.locator(
        "//div[@class='account-summary']"
      );
      await expect(profileSection).toBeVisible();
      // screenshot s tolerancí 5 %
      expect(await profileSection.screenshot()).toMatchSnapshot(
        "profile_filled.png",
        { maxDiffPixelRatio: 0.05 }
      );
    });
  }
);
