import type { Currency } from '@internal/prisma/client';

export type GetCurrencyResponse = Readonly<
  Pick<Currency, 'code' | 'id' | 'name' | 'symbol' | 'symbol_native'>
>;

export type CreateCurrencyRespnse = Readonly<Currency>;
