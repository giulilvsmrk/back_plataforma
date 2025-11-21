import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  order: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  resource_url: string;

  @IsUUID()
  @IsNotEmpty()
  topic_uuid: string;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
