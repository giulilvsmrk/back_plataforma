import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/entity/user.entity';
import { RoleEntity } from '../user/entity/role.entity';
import { RoleUserEntity } from '../user/entity/role_user.entity';
import { UpdateRoleDto } from '../user/dto/update-role.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(RoleUserEntity)
    private readonly roleUserRepository: Repository<RoleUserEntity>,
  ) {}

  async updateUserRole(
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    const { userId, roleName } = updateRoleDto;

    const user = await this.userRepository.findOneBy({ uuid_user: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    const role = await this.roleRepository.findOneBy({ name: roleName });
    if (!role) {
      throw new NotFoundException(`Rol '${roleName}' no encontrado.`);
    }

    const userRole = await this.roleUserRepository.findOne({
      where: { user: { uuid_user: userId } },
    });

    if (!userRole) {
      throw new BadRequestException(
        `El usuario no tiene un rol asignado para modificar.`,
      );
    }

    userRole.role = role;
    await this.roleUserRepository.save(userRole);

    return { message: 'Rol de usuario actualizado correctamente.' };
  }
}
