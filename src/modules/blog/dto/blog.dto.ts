import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { BlogStatus } from '../enum/status.enum';

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 100)
  title: string;

  @ApiPropertyOptional({ format: 'binary' })
  image: string;

  @ApiPropertyOptional()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  time_for_study: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 100)
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 300)
  description: string;

  @ApiProperty()
  @IsEnum(BlogStatus)
  status: string;
}
