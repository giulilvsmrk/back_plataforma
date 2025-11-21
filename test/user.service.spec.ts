import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { UserService } from '../src/user/user.service';
import { UserEntity } from '../src/user/entity/user.entity';
import { RoleEntity } from '../src/user/entity/role.entity';
import { RoleUserEntity } from '../src/user/entity/role_user.entity';
import { UserDto } from '../src/user/dto/user.dto';

jest.mock('bcrypt');
jest.mock('crypto');

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    save: jest.fn(),
    exists: jest.fn(),
  };

  const mockRoleRepository = {
    findOne: jest.fn(),
  };

  const mockRoleUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'DEFAULT_USER_ROLE') {
        return 'alumno';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    it('debería registrar un nuevo usuario y retornar la entidad guardada', async () => {
      const userDto: UserDto = {
        name: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'password123',
      };
      const hashedPassword = 'hashedPassword';
      const confirmationToken = 'random-token';
      const role = new RoleEntity();
      role.name = 'alumno';
      const userRole = new RoleUserEntity();

      mockUserRepository.exists.mockResolvedValue(false);
      mockRoleRepository.findOne.mockResolvedValue(role);
      mockRoleUserRepository.create.mockReturnValue(userRole);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: () => confirmationToken,
      });
      mockUserRepository.save.mockImplementation((user) =>
        Promise.resolve(user),
      );

      const result = await service.registerUser(userDto);

      expect(mockUserRepository.exists).toHaveBeenCalledWith({
        where: [{ email: userDto.email }],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 10);
      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.any(UserEntity),
      );
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'alumno' },
      });
      expect(mockRoleUserRepository.create).toHaveBeenCalled();
      expect(mockRoleUserRepository.save).toHaveBeenCalledWith(userRole);
      expect(result.email).toBe(userDto.email);
      expect(result.password).toBe(hashedPassword);
      expect(result.confirmationToken).toBe(confirmationToken);
    });

    it('debería lanzar BadRequestException si el email ya existe', async () => {
      const userDto: UserDto = {
        name: 'Test',
        lastname: 'User',
        email: 'exists@example.com',
        password: 'password123',
      };

      mockUserRepository.exists.mockResolvedValue(true);

      await expect(service.registerUser(userDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if default role does not exist', async () => {
      const userDto: UserDto = {
        name: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'password123',
      };
      mockUserRepository.exists.mockResolvedValue(false);
      mockRoleRepository.findOne.mockResolvedValue(null);

      await expect(service.registerUser(userDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
