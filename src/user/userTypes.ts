export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
}

export type IUserWithoutPass = Omit<IUser, 'password'>;
