import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as config from '../../config/config';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization) {

        let authentication = request.headers.authorization.replace(/^Basic/, '');
        authentication = (new Buffer(authentication, 'base64')).toString('utf8');
        const loginInfo = authentication.split(':');

        if (loginInfo[0] === config.getEnv().access.username && loginInfo[1] === config.getEnv().access.password) {
            return true;
        }
    }
    return false;
  }
}
