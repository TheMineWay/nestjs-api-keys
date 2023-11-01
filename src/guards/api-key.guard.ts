import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TMWU_API_KEYS_PROVIDER } from './api-keys.module';
import { ApiKeysContext } from './types/api-keys-context.type';

type Options<T extends string> = {
  permissions?: T[];
};

export const ApiKeyGuard = <T extends string = string>({
  permissions: requiredPermissions,
}: Options<T>) => {
  class ApiKeyGuardMixin implements CanActivate {
    constructor(
      @Inject(TMWU_API_KEYS_PROVIDER)
      public readonly apiKeysContext: ApiKeysContext<T>,
    ) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request: Request = context.switchToHttp().getRequest();

      const headerApiKey =
        request.headers[this.apiKeysContext.apiKeyHeader ?? 'api-key'];

      return this.apiKeysContext.apiKeys.some(
        ({ keys, permissions }) =>
          keys.includes(headerApiKey) &&
          (requiredPermissions === undefined ||
            requiredPermissions?.every((requiredPermission) =>
              permissions.includes(requiredPermission),
            )),
      );
    }
  }

  const guard = mixin(ApiKeyGuardMixin);
  return guard;
};
