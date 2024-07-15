import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { AuthMessage, BadRequestMessage, PublicMessage } from 'src/common/enums/message.enum';
import { randomInt } from 'crypto';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './tokens.service';
import { Request, Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthResponse } from './types/response';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileReository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    @Inject(REQUEST) private request: Request,
    private tokenService: TokenService,
  ) {}

  async userExistence(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        return this.sendResponse(res, result);
      case AuthType.Register:
        result = await this.register(method, username);
        return this.sendResponse(res, result);

      default:
        throw new UnauthorizedException();
    }
  }
  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user: UserEntity | null = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });

    return {
      token,
      code: otp.code,
    };
  }

  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    let user: UserEntity | null = await this.checkExistUser(method, validUsername);
    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);

    if (method === AuthMethod.Username)
      throw new BadRequestException(BadRequestMessage.InValidRegisterData);

    user = this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);
    const otp = await this.saveOtp(user.id);

    const token = this.tokenService.createOtpToken({ userId: user.id });

    return {
      token,
      code: otp.code,
    };
  }

  async sendResponse(res: Response, result: AuthResponse) {
    const { token, code } = result;

    res.cookie(CookieKeys.OTP, token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000 * 2),
    });
    res.json({
      message: PublicMessage.SendOtp,
      code,
    });
  }

  async checkOtp(code: string) {
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    const { userId } = this.tokenService.verifyOtpToken(token);
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException(AuthMessage.TryAgain);
    const now = new Date();
    if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    if (otp.code !== code) throw new UnauthorizedException(AuthMessage.LoginAgain);
    return {
      message: PublicMessage.LoggedIn,
    };
  }

  async saveOtp(userId: number) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 60 * 1000 * 2);
    let otp = await this.otpRepository.findOneBy({ userId });
    let existOtp = false;
    if (otp) {
      existOtp = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        userId,
      });
    }
    otp = await this.otpRepository.save(otp);

    if (!existOtp) {
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    }

    return otp;
  }

  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity | null;

    if (method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({ phone: username });
    } else if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({ email: username });
    } else if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({ username });
    } else {
      throw new BadRequestException(BadRequestMessage.InValidLoginData);
    }

    return user;
  }

  usernameValidator(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException('email format is incorrect');
      case AuthMethod.Phone:
        if (isMobilePhone(username, 'fa-IR')) return username;
        throw new BadRequestException('mobile number format is incorrect');
      case AuthMethod.Username:
        return username;
      default:
        throw new UnauthorizedException('username data is not valid');
    }
  }
}
