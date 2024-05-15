import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserRepository } from 'src/modules/iam/application/ports/create-user.repository';
import { OrmCreateUserRepository } from './repositories/create-user.repository';
import { FindUserRepository } from 'src/modules/iam/application/ports/find-user.repository';
import { OrmFindUserRepository } from './repositories/find-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: CreateUserRepository,
      useClass: OrmCreateUserRepository,
    },
    {
      provide: FindUserRepository,
      useClass: OrmFindUserRepository,
    },
  ],
  exports: [CreateUserRepository, FindUserRepository],
})
export class OrmIamPersistenceModule { }
