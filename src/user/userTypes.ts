export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  pw_reset_token?: string;
}

export type IUserWithoutPass = Omit<IUser, 'password'>;
