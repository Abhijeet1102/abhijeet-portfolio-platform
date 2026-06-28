export class AuthService {
  static async login(data: any) { return { accessToken: 'token', refreshToken: 'token' }; }
  static async register(data: any) { return { success: true }; }
  static async refreshToken(token: string) { return { accessToken: 'new-token' }; }
}
