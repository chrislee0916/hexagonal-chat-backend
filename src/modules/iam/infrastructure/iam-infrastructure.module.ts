import { Module } from '@nestjs/common';
import { OrmIamPersistenceModule } from './persistence/orm/orm-persistence.module';
import { BcryptModule } from './hashing/bcrypt/bcrypt.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../domain/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { RedisRefreshTokenIdsStorageModule } from './refresh-token-ids-storage/redis/redis-refresh-token-ids.storage.module';

@Module({})
export class IamInfrastructureModule {
  static use(driver: 'orm') {
    return {
      module: IamInfrastructureModule,
      imports: [
        OrmIamPersistenceModule,
        BcryptModule,
        RedisRefreshTokenIdsStorageModule,
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
      ],
      exports: [
        OrmIamPersistenceModule,
        BcryptModule,
        RedisRefreshTokenIdsStorageModule,
        JwtModule,
        ConfigModule
      ],
    };
  }
}
