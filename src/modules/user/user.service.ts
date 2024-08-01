import { BadRequestException, ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';
import {
  AuthMessage,
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { AuthService } from '../auth/auth.service';
import { AuthMethod } from '../auth/enums/method.enum';
import { TokenService } from '../auth/tokens.service';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { OtpEntity } from './entities/otp.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}
  async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
    if (files?.image_profile?.length > 0) {
      let [image] = files?.image_profile;
      profileDto.image_profile = image.path.replace(/\\/g, '/').replace('public', '');
    }
    if (files?.bg_image?.length > 0) {
      let [image] = files?.bg_image;
      profileDto.bg_image = image.path.replace(/\\/g, '/').replace('public', '');
    }
    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const {
      bio,
      birthday,
      gender,
      nick_name,
      linkedin_profile,
      x_profile,
      bg_image,
      image_profile,
    } = profileDto;
    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = birthday;
      if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
      if (nick_name) profile.nick_name = nick_name;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (image_profile) profile.image_profile = image_profile;
      if (bg_image) profile.bg_image = bg_image;
    } else {
      profile = this.profileRepository.create({
        nick_name,
        bio,
        birthday,
        gender,
        linkedin_profile,
        x_profile,
        userId,
        image_profile,
        bg_image,
      });
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update({ id: userId }, { profileId: profile.id });
    }
    return {
      message: PublicMessage.Updated,
    };
  }

  profile() {
    const { id } = this.request.user;
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ email });
    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.Email);
    } else if (user && user.id == id) {
      return {
        message: PublicMessage.Updated,
      };
    }

    await this.userRepository.update({ id }, { new_email: email });
    const otp = await this.authService.saveOtp(id, AuthMethod.Email);
    const token = this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.EmailOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { email } = this.tokenService.verifyEmailToken(token);
    if (email !== new_email) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
    const otp = await this.checkOtp(userId, code);
    if (otp.method !== AuthMethod.Email) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }

    await this.userRepository.update(
      { id: userId },
      {
        email,
        verify_email: true,
        new_email: null,
      },
    );
    return {
      message: PublicMessage.Updated,
    };
  }

  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException(NotFoundMessage.NotFound);
    const now = new Date();
    if (otp.expiresIn < now) throw new BadRequestException(AuthMessage.ExpiredCode);
    if (otp.code !== code) throw new BadRequestException(AuthMessage.TryAgain);
    return otp;
  }
}
