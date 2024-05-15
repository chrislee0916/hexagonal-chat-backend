import { Module } from '@nestjs/common';
import { OrmIamPersistenceModule } from './persistence/orm/orm-persistence.module';
import { BcryptModule } from './hashing/bcrypt/bcrypt.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class IamInfrastructureModule {
  static use(driver: 'orm') {
    return {
      module: IamInfrastructureModule,
      imports: [
        OrmIamPersistenceModule,
        BcryptModule,
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
      ],
      exports: [
        OrmIamPersistenceModule,
        BcryptModule,
        JwtModule,
        ConfigModule
      ],
    };
  }
}
