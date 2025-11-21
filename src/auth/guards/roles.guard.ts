import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../models/roles.model';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no se especifican roles, se permite el acceso.
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserEntity | undefined;

    return requiredRoles.some((role) =>
      user?.user_role.some((ur) => ur.role.name === String(role)),
    );
  }
}
