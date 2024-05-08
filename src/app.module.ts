import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './modules/iam/application/iam.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommonModule } from './common/common.module';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { IamInfrastructureModule } from './modules/iam/infrastructure/iam-infrastructure.module';
import { CoreModule } from './core/core.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      // envFilePath: ['.env'],
      validationSchema: Joi.object({
        APP_DEBUG: Joi.boolean().required(),
        APP_HOST: Joi.string().required(),
        APP_PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASS: Joi.string().required(),
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
      ],
    };
  }
}
