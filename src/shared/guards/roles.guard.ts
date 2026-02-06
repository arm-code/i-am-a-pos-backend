import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        // Basic check for demonstration. In a real app, 'user' is populated by an AuthGuard.
        // If no user is found, we might check a header for testing purposes or just return false.
        if (!user) {
            // For development/test without full auth, you might uncomment the next line:
            // const role = context.switchToHttp().getRequest().headers['x-role'];
            // return requiredRoles.some((role) => role === role);
            return false;
        }

        return requiredRoles.some((role) => user.role?.name === role);
    }
}
