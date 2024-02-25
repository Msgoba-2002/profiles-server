import { IUser, IUserWithoutPass } from '../user/userTypes';

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
    public readonly user: IUserWithoutPass,
    public token: string,
    public resetBaseUrl: string,
  ) {
    this.resetUrl = `${resetBaseUrl}/reset-password?token=${token}`;
  }
}

export class PasswordResetEvent {
  constructor(public user: IUserWithoutPass) {}
}
