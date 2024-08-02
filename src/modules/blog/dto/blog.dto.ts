import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, Length } from 'class-validator';
import { BlogStatus } from '../enum/status.enum';

export class CreateBlogDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty()
  @Length(10, 100)
  title: string;

  @ApiPropertyOptional({ example: '' })
  image: string;

  @ApiPropertyOptional({ example: '' })
  slug: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  @IsNumberString()
  time_for_study: number;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  @Length(10, 100)
  content: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  @Length(10, 300)
  description: string;

  status: string;
}

export class FilterBlogDto {
  search: string;
}
