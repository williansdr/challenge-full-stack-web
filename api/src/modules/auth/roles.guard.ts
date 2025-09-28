import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

import { ROLES_KEY } from '../../shared/decorators/Roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userRole = request.userRole;

    if (!userRole) {
      throw new ForbiddenException('User role not found. Make sure you are authenticated.');
    }

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${userRole}`,
      );
    }

    return true;
  }
}
