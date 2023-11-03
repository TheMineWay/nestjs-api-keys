import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from "@nestjs/common";
import { ApiKeysSafeContext } from "../types";
import { API_KEY_HEADER_NAME } from "../constants/api-key-header-name.constant";

export const HeaderApiKey = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req: {
      headers: Record<string, string>;
      tmwuApiKeysContext?: ApiKeysSafeContext;
    } = ctx.switchToHttp().getRequest();

    if (!req.tmwuApiKeysContext) throw new InternalServerErrorException();

    return req.headers[
      req.tmwuApiKeysContext.apiKeyHeader ?? API_KEY_HEADER_NAME
    ];
  }
);
