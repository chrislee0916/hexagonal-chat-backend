import { Module } from '@nestjs/common';
import { OrmIamPersistenceModule } from './persistence/orm/orm-persistence.module';
import { BcryptModule } from './hashing/bcrypt/bcrypt.module';

@Module({})
export class IamInfrastructureModule {
  static use(driver: 'orm') {
    return {
      module: IamInfrastructureModule,
      imports: [OrmIamPersistenceModule, BcryptModule],
      exports: [OrmIamPersistenceModule, BcryptModule],
    };
  }
}
