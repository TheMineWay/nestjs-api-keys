import { CanActivate, ExecutionContext, Inject, mixin } from "@nestjs/common";
import { Observable } from "rxjs";
import { ApiKeysContext } from "../types";
import { TMWU_API_KEYS_PROVIDER } from "../modules";

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
      const request: { headers: Record<string, string> } = context
        .switchToHttp()
        .getRequest();

      const headerName = this.apiKeysContext.apiKeyHeader ?? "api-key";

      const headerApiKey = request.headers[headerName] as string;

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
