import { IReqAccount } from '../modules/auth/interface/account.interface';

declare module 'express' {
  export interface Request {
    user: IReqAccount;
  }
}
