import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  priority: number;
}
