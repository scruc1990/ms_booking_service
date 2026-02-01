import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Request } from 'express';
import { Observable, from, of } from 'rxjs';
import { switchMap, concatMap } from 'rxjs/operators';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.headers['x-idempotency-key'] as string;

    if (!key) {
      throw new BadRequestException('x-idempotency-key is missing');
    }

    return from(this.redis.get(key)).pipe(
      switchMap((cachedResponse) => {
        if (cachedResponse) {
          console.log('Retornando respuesta desde caché de Redis');
          return of(JSON.parse(cachedResponse) as T);
        }
        return next.handle().pipe(
          concatMap(async (response) => {
            await this.redis.set(key, JSON.stringify(response), 'EX', 86400);
            return response;
          }),
        );
      }),
    );
  }
}
