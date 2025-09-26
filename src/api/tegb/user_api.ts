import { APIRequestContext } from "@playwright/test";
export class UserApi {
  readonly request: APIRequestContext;
  readonly apiUrl = "https://tegb-backend-877a0b063d29.herokuapp.com/tegb";
  constructor(request: APIRequestContext) {
    this.request = request;
  }
  async loginUser(username: string, password: string) {
    const response = await this.request.post(`${this.apiUrl}/login`, {
      data: { username, password },
      headers: { "Content-Type": "application/json" },
    });
    return response;
  }
  async createAccount(token: string, startBalance: number, type: string) {
    const response = await this.request.post(`${this.apiUrl}/accounts/create`, {
      data: { startBalance, type },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}
