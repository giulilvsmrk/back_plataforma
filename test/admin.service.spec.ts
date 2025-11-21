import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { AdminService } from '../src/admin/admin.service';
import { UserEntity } from '../src/user/entity/user.entity';
import { RoleEntity } from '../src/user/entity/role.entity';
import { RoleUserEntity } from '../src/user/entity/role_user.entity';
import { UpdateRoleDto } from '../src/user/dto/update-role.dto';

describe('AdminService', () => {
  let service: AdminService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockRoleRepository = {
    findOneBy: jest.fn(),
  };

  const mockRoleUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(RoleUserEntity),
          useValue: mockRoleUserRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateUserRole', () => {
    const updateRoleDto: UpdateRoleDto = {
      userId: 'user-uuid',
      roleName: 'admin',
    };
    const user = new UserEntity();
    const role = new RoleEntity();
    const userRole = new RoleUserEntity();

    it('should update user role successfully', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockRoleRepository.findOneBy.mockResolvedValue(role);
      mockRoleUserRepository.findOne.mockResolvedValue(userRole);
      mockRoleUserRepository.save.mockResolvedValue(userRole);

      const result = await service.updateUserRole(updateRoleDto);

      expect(result).toEqual({
        message: 'Rol de usuario actualizado correctamente.',
      });
      expect(mockRoleUserRepository.save).toHaveBeenCalledWith({
        ...userRole,
        role,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      await expect(service.updateUserRole(updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if role not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockRoleRepository.findOneBy.mockResolvedValue(null);
      await expect(service.updateUserRole(updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if user role not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockRoleRepository.findOneBy.mockResolvedValue(role);
      mockRoleUserRepository.findOne.mockResolvedValue(null);
      await expect(service.updateUserRole(updateRoleDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
