import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { RoleEntity } from './entity/role.entity';
import { RoleUserEntity } from './entity/role_user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(RoleUserEntity)
    private readonly roleUserRepository: Repository<RoleUserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(
    date: UserDto,
    isGoogleSignIn = false,
  ): Promise<UserEntity> {
    const validate = await this.validateExists(date.email);
    if (validate) throw new BadRequestException('El correo ya existe');

    const role = await this.getDefaultRole();

    const new_user = new UserEntity();
    new_user.email = date.email;
    new_user.password = await bcrypt.hash(date.password, 10);
    new_user.name = date.name;
    new_user.lastname = date.lastname;

    if (isGoogleSignIn) {
      new_user.isConfirmed = true;
    } else {
      new_user.confirmationToken = crypto.randomBytes(32).toString('hex');
    }
    const savedUser = await this.userRepository.save(new_user);

    const userRole = this.roleUserRepository.create({ user: savedUser, role });
    await this.roleUserRepository.save(userRole);

    return savedUser;
  }

  private async getDefaultRole(): Promise<RoleEntity> {
    const roleName =
      this.configService.get<string>('DEFAULT_USER_ROLE') ?? 'alumno';

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) throw new NotFoundException(`El rol '${roleName}' no existe.`);
    return role;
  }

  async validateExists(mail: string): Promise<boolean> {
    const validate = await this.userRepository.exists({
      where: [{ email: mail }],
    });
    return validate;
  }

  async search_email(email: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async findByConfirmationToken(
    token: string,
  ): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: { confirmationToken: token },
    });
    return user ?? undefined;
  }

  async getProfile(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { uuid_user: id },
      relations: ['user_role', 'user_role.role'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const { ...userWithoutPassword } = user;
    return userWithoutPassword as UserEntity;
  }

  async getusers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({
      relations: ['user_role', 'user_role.role'],
    });
    return users;
  }
}
