import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}
  async changeProfile(profileDto: ProfileDto) {
    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const { bio, birthday, gender, nick_name, linkedin_profile, x_profile } = profileDto;
    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(birthday)) profile.birthday = birthday;
      if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
      if (nick_name) profile.nick_name = nick_name;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
    } else {
      profile = this.profileRepository.create({
        bio,
        birthday,
        gender,
        nick_name,
        linkedin_profile,
        x_profile,
        userId,
      });
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update({ id: userId }, { profileId: profile.id });
    }
  }
}
