import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export const GetUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: UserPayload }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
