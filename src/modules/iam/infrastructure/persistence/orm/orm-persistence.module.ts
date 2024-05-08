import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserRepository } from 'src/modules/iam/application/ports/create-user.repository';
import { OrmCreateUserRepository } from './repositories/create-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: CreateUserRepository,
      useClass: OrmCreateUserRepository,
    },
  ],
  exports: [CreateUserRepository],
})
export class OrmIamPersistenceModule {}
