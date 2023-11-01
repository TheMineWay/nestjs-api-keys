export interface ApiKey<T extends string = string> {
  name: string; // <- Name for the API key
  keys: string[]; // <- API keys
  permissions: T[]; // <- Permissions granted
}
