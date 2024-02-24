import { IUser } from '../user/userTypes';

export class UserRegisteredEvent {
  public verificationUrl: string;

  constructor(
    public readonly user: IUser,
    token: string,
    veriBaseUrl: string,
  ) {
    this.verificationUrl = `${veriBaseUrl}/verify-email?token=${token}`;
  }
}

export class PasswordResetRequestEvent {
  public resetUrl: string;

  constructor(
    public readonly email: string,
    public resetBaseUrl: string,
    public token: string,
  ) {
    this.resetUrl = `${resetBaseUrl}/reset-password?token=${token}`;
  }
}
