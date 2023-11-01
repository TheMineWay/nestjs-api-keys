import { DynamicModule, Global, Module, Options } from '@nestjs/common';
import { ApiKey } from './types/api-key.type';
import { ApiKeysContext } from './types/api-keys-context.type';

export const TMWU_API_KEYS_PROVIDER = 'TMWU_API_KEYS_PROVIDER';

type Options<T extends string> = {
  apiKeys: ApiKey<T>[];
  apiKeyHeader?: string;
};

@Global()
@Module({})
export class ApiKeysModule {
  static register<T extends string = string>({
    apiKeys,
    apiKeyHeader,
  }: Options<T>): DynamicModule {
    const context: ApiKeysContext<T> = {
      apiKeys,
      apiKeyHeader,
    };

    return {
      module: ApiKeysModule,
      providers: [
        {
          provide: TMWU_API_KEYS_PROVIDER,
          useValue: context,
        },
      ],
      exports: [TMWU_API_KEYS_PROVIDER],
    };
  }

  static async registerAsync<T extends string = string>(
    fn: () => Promise<Options<T>>,
  ): Promise<DynamicModule> {
    return ApiKeysModule.register<T>(await fn());
  }
}
