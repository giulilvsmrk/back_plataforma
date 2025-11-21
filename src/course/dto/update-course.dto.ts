import { PartialType } from '@nestjs/mapped-types';

import { CourseDto } from './course.dto';

export class UpdateCourseDto extends PartialType(CourseDto) {}
