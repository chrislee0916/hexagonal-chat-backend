import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../impl/get-user.query';
import { FindUserRepository } from '../../ports/find-user.repository';
import { GetUserResponseDto } from 'src/modules/iam/presenters/http/dto/response/get-friends.response.dto';

@QueryHandler(GetUserQuery)
export class GetFriendsQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetFriendsQueryHandler.name);

  constructor(private readonly userRepository: FindUserRepository) {}

  async execute(query: GetUserQuery): Promise<GetUserResponseDto> {
    this.logger.debug(
      `Processing "${GetUserQuery.name}": ${JSON.stringify(query)}`,
    );
    let user = await this.userRepository.findOneById(query.userId);

    user.password = undefined;
    return user;
  }
}
