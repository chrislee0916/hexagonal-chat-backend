import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './modules/iam/application/iam.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommonModule } from './common/common.module';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { IamInfrastructureModule } from './modules/iam/infrastructure/iam-infrastructure.module';
import { CoreModule } from './core/core.module';
import { ChatModule } from './modules/chat/application/chat.module';
import { ChatInfrastrucutureModule } from './modules/chat/infrastructure/chat-infrastrucuture.module';
import * as Joi from '@hapi/joi';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/storage',
      exclude: ['/api/(.*)'],
    }),
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      // envFilePath: ['.env'],
      validationSchema: Joi.object({
        // * application
        APP_DEBUG: Joi.boolean().required(),
        APP_HOST: Joi.string().required(),
        APP_PORT: Joi.number().required(),
        // * write-db
        POSTGRES_PASSWORD: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASS: Joi.string().required(),
        // * read-db
        MONGODB_HOST: Joi.string().required(),
        MONGODB_PORT: Joi.number().required(),
        MONGODB_NAME: Joi.string().required(),
        // * token-storage
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        // * JWT
        JWT_SECRET: Joi.string().required(),
        JWT_TOKEN_AUDIENCE: Joi.string().required(),
        JWT_TOKEN_ISSUER: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
        JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
      }),
    }),
    CommonModule,
  ],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        IamModule.withInfrastructure(
          IamInfrastructureModule.use(options.driver),
        ),
        ChatModule.withInfrastructure(
          ChatInfrastrucutureModule.use(options.driver),
        ),
      ],
    };
  }
}
