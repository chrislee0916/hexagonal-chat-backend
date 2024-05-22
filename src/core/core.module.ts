import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';

export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions): DynamicModule {
    const imports =
      options.driver === 'orm'
        ? [
            TypeOrmModule.forRoot({
              type: options.type,
              host: process.env.DATABASE_HOST,
              port: +process.env.DATABASE_PORT,
              username: process.env.DATABASE_USERNAME,
              password: process.env.DATABASE_PASS,
              autoLoadEntities: true,
              synchronize: false,
            }),
            RedisModule.forRoot({
              readyLog: true,
              config: {
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT,
              },
            }),
            MongooseModule.forRoot(
              `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`,
            ),
          ]
        : [];
    return {
      module: CoreModule,
      imports,
    };
  }
}
