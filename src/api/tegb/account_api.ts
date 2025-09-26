import { APIRequestContext } from "@playwright/test";
export class AccountApi {
  readonly request: APIRequestContext;
  readonly apiUrl = "https://tegb-backend-877a0b063d29.herokuapp.com/tegb";
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createAccount(token: string, startBalance: number, type: string) {
    const response = await this.request.post(`${this.apiUrl}/accounts/create`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { startBalance, type },
    });
    return response;
  }
}
