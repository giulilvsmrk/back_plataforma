import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
