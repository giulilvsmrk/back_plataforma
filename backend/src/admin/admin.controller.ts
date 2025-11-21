import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AdminService } from './admin.service';
import { UpdateRoleDto } from '../user/dto/update-role.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('role/update')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateUserRole(@Body() updateRoleDto: UpdateRoleDto) {
    return this.adminService.updateUserRole(updateRoleDto);
  }
}
