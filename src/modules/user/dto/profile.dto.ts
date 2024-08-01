import { IsEmail, IsEnum, IsMobilePhone, IsOptional, Length } from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationMessage } from 'src/common/enums/message.enum';

export class ProfileDto {
  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @Length(3, 100)
  nick_name: string;

  @ApiPropertyOptional({ nullable: true, example: '' })
  @IsOptional()
  @Length(10, 200)
  bio: string;

  @ApiPropertyOptional({ nullable: true, format: 'binary', example: '' })
  image_profile: string;

  @ApiPropertyOptional({ nullable: true, format: 'binary', example: '' })
  bg_image: string;

  @ApiPropertyOptional({ nullable: true, enum: Gender, example: '' })
  @IsOptional()
  @IsEnum(Gender)
  gender: string;

  @ApiPropertyOptional({ nullable: true, example: '1996-02-22T12:01:26.487Z' })
  birthday: Date;

  @ApiPropertyOptional({ nullable: true, example: '' })
  x_profile: string;

  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: ValidationMessage.InvalidEmailFormat })
  email: string;
}
export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: ValidationMessage.InvalidPhoneFormat })
  phone: string;
}
