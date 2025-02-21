import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AccessTokenGuard } from './guards/access-token.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ParseQueryMiddleware } from './middleware/parse-query.middleware';

@Module({
  imports: [JwtModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
          disableErrorMessages: process.env.APP_DEBUG === 'false',
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ParseQueryMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
