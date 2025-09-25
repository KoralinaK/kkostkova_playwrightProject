import { APIRequestContext } from "@playwright/test";
export class RegisterApi {
  readonly request: APIRequestContext;
  readonly apiUrl = "https://tegb-backend-877a0b063d29.herokuapp.com/tegb";
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async registerUser(username: string, password: string, email: string) {
    const response = this.request.post(`${this.apiUrl}/register`, {
      data: {
        username,
        email,
        password,
      },
    });
    return response;
  }
}
