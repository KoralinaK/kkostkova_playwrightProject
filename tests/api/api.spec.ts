import { test, expect } from "@playwright/test";
import { UserApi } from "../../src/api/tegb/user_api.ts";
import { RegisterApi } from "../../src/api/tegb/register_api.ts";
import { fakerCS_CZ as faker } from "@faker-js/faker";
//import dotenv from "dotenv";
//dotenv.config();

test("Login API should return access token", async ({ request }) => {
  /*const username = process.env.TEGB_USERNAME as string;
  const password = process.env.TEGB_PASSWORD as string;
  */
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const apiUser = new UserApi(request);
  const apiRegister = new RegisterApi(request);

  const registerResponse = await apiRegister.registerUser(
    username,
    password,
    email
  );
  expect(registerResponse.status(), "Register Response Status is 201").toBe(
    201
  );
  const loginResponse = await apiUser.loginUser(username, password);
  expect(loginResponse.status(), "Status should be 201").toBe(201);
  const body = await loginResponse.json();
  expect(body.access_token, "Access token should exist").toBeTruthy();
});
