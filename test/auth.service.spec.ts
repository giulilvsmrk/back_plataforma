import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GoogleAuthDto } from 'src/auth/dto/google-auth.dto';

import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { UserEntity } from '../src/user/entity/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    search_email: jest.fn(),
    registerUser: jest.fn(),
    getProfile: jest.fn(),
    findByConfirmationToken: jest.fn(),
    userRepository: { save: jest.fn() },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('debería retornar un token y el perfil del usuario si las credenciales son válidas', async () => {
      const user: UserEntity = {
        uuid_user: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test',
        lastname: 'User',
        isConfirmed: true,
        confirmationToken: null,
        user_role: [],
      };
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const token = 'jwt-token';

      mockUserService.search_email.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);
      mockUserService.getProfile.mockResolvedValue(user);

      const result = await service.login(loginDto);

      expect(userService.search_email).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.uuid_user,
        email: user.email,
        roles: user.user_role.map((role) => role.role.name),
      });
      expect(result.token).toEqual(token);
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      const loginDto = { email: 'wrong@example.com', password: 'password123' };
      mockUserService.search_email.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const user: UserEntity = {
        uuid_user: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test',
        lastname: 'User',
        isConfirmed: true,
        confirmationToken: null,
        user_role: [],
      };
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      mockUserService.search_email.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signInWithGoogle', () => {
    const googleUser: GoogleAuthDto = {
      email: 'google@example.com',
      name: 'Google',
      lastname: 'User',
    };
    const userEntity = new UserEntity();
    userEntity.uuid_user = 'google-uuid';
    userEntity.email = googleUser.email;
    userEntity.user_role = [];

    it('should login an existing user', async () => {
      mockUserService.search_email.mockResolvedValue(userEntity);
      mockUserService.getProfile.mockResolvedValue(userEntity);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.signInWithGoogle(googleUser);

      expect(userService.search_email).toHaveBeenCalledWith(googleUser.email);
      expect(userService.registerUser).not.toHaveBeenCalled();
      expect(result.token).toBe('jwt-token');
    });

    it('should register and login a new user', async () => {
      mockUserService.search_email.mockResolvedValue(null);
      mockUserService.registerUser.mockResolvedValue(userEntity);
      mockUserService.getProfile.mockResolvedValue(userEntity);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.signInWithGoogle(googleUser);

      expect(userService.search_email).toHaveBeenCalledWith(googleUser.email);
      expect(userService.registerUser).toHaveBeenCalled();
      expect(result.token).toBe('jwt-token');
    });

    it('should throw BadRequestException if googleUser is invalid', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await expect(service.signInWithGoogle({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('confirmEmail', () => {
    it('should confirm user email', async () => {
      const user = new UserEntity();
      user.isConfirmed = false;
      user.confirmationToken = 'some-token';

      mockUserService.findByConfirmationToken.mockResolvedValue(user);

      const result = await service.confirmEmail('some-token');

      expect(user.isConfirmed).toBe(true);
      expect(user.confirmationToken).toBeNull();
      expect(userService.userRepository.save).toHaveBeenCalledWith(user);
      expect(result.message).toContain('confirmado con éxito');
    });

    it('should throw NotFoundException if token is invalid', async () => {
      mockUserService.findByConfirmationToken.mockResolvedValue(null);

      await expect(service.confirmEmail('invalid-token')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
