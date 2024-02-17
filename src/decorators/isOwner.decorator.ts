import { SetMetadata } from '@nestjs/common';

export const REQUESTING_USER = 'requestingUser';
export const IsOwner = (user_id: string) =>
  SetMetadata(REQUESTING_USER, user_id);
