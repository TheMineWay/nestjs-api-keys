import { CanActivate, ExecutionContext, Inject, mixin } from "@nestjs/common";
import { Observable } from "rxjs";
import { ApiKeysContext } from "../types";
import { TMWU_API_KEYS_PROVIDER } from "../modules";
import { ApiKeysSafeContext } from "../types/api-keys-safe-context.type";
import { API_KEY_HEADER_NAME } from "../constants/api-key-header-name.constant";

type Options<T extends string> = {
  permissions?: T[];
};

export const ApiKeyGuard = <T extends string = string>({
  permissions: requiredPermissions,
}: Options<T>) => {
  class ApiKeyGuardMixin implements CanActivate {
    constructor(
      @Inject(TMWU_API_KEYS_PROVIDER)
      public readonly apiKeysContext: ApiKeysContext<T>
    ) {}

    canActivate(
      context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request: {
        headers: Record<string, string>;
        tmwuApiKeysContext?: ApiKeysSafeContext;
      } = context.switchToHttp().getRequest();

      const headerName =
        this.apiKeysContext.apiKeyHeader ?? API_KEY_HEADER_NAME;

      const headerApiKey = request.headers[headerName] as string;

      // Store API Keys context so it can be read with decorators
      const { apiKeys, ...apiKeysSafeContext } = this.apiKeysContext;
      request.tmwuApiKeysContext = apiKeysSafeContext;

      return this.apiKeysContext.apiKeys.some(
        ({ keys, permissions }) =>
          keys.includes(headerApiKey) &&
          (requiredPermissions === undefined ||
            requiredPermissions?.every((requiredPermission) =>
              permissions.includes(requiredPermission)
            ))
      );
    }
  }

  const guard = mixin(ApiKeyGuardMixin);
  return guard;
};
