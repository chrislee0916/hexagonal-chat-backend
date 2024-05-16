import { InjectRepository } from "@nestjs/typeorm";
import { FindUserRepository } from "src/modules/iam/application/ports/find-user.repository";
import { User } from "src/modules/iam/domain/user";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { ErrorMsg } from "src/common/enums/err-msg.enum";
import { UserMapper } from "../mappers/user.mapper";

export class OrmFindUserRepository implements FindUserRepository {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async findOneByEmail(email: string): Promise<User> {
    const userEntity = await this.userRepository.findOneBy({ email });
    if (!userEntity) {
      throw new UnauthorizedException(ErrorMsg.ERR_AUTH_SIGNIN_NOT_EXIST)
    }
    return UserMapper.toDomain(userEntity);
  }

  async findOneById(id: number): Promise<User> {
    const userEntity = await this.userRepository.findOneBy({ id });
    if (!userEntity) {
      throw new UnauthorizedException(ErrorMsg.ERR_AUTH_SIGNIN_NOT_EXIST)
    }
    return UserMapper.toDomain(userEntity);
  }
}
