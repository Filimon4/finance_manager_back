/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountRequestDto } from '../account/dto/account.dto';
import { IAccount } from './interface/account.interface';
import { IJwtTokens } from './interface/jwt.interface';
import * as bcrypt from 'bcrypt';
import { SinginRequestDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: CreateAccountRequestDto): Promise<IJwtTokens> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(dto.password, salt);

    const account = await this.accountService.createAccount({
      ...dto,
      password: hashPassword,
    });

    return this.jwtTokens(account);
  }

  async signIn(dto: SinginRequestDto): Promise<IJwtTokens> {
    const account = await this.validateAccount(dto);
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.jwtTokens(account);
  }

  private async validateAccount(dto: SinginRequestDto): Promise<IAccount> {
    const account = await this.accountService.findByEmail(dto.email);

    if (!account) throw new Error('There is not account');
    const compare = await bcrypt.compare(dto.password, account.password);

    if (!compare) throw new Error('');

    return account;
  }

  private jwtTokens(account: IAccount): IJwtTokens {
    const accessToken = this.jwtService.sign({
      email: account.email,
      sub: account.id,
    });
    const refreshToken = this.jwtService.sign(
      {
        sub: account.id,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
