import { type Account } from '@internal/prisma/client';

export type IAccount = Pick<Account, 'id' | 'email' | 'password'>;
export type IReqAccount = Pick<Account, 'id' | 'email'>;
