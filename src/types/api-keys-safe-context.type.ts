import { ApiKeysContext } from "./api-keys-context.type";

export interface ApiKeysSafeContext extends Omit<ApiKeysContext, "apiKeys"> {}
