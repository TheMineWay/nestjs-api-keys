import { ApiKey } from './api-key.type';

export interface ApiKeysContext<T extends string = string> {
  apiKeys: ApiKey<T>[];
  apiKeyHeader?: string;
}
