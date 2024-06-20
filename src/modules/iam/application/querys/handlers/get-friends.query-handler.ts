import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFriendsQuery } from '../impl/get-friends.query';
import { FindUserRepository } from '../../ports/find-user.repository';

@QueryHandler(GetFriendsQuery)
export class GetFriendsQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetFriendsQueryHandler.name);

  constructor(private readonly userRepository: FindUserRepository) {}

  async execute(query: GetFriendsQuery): Promise<any> {}
}
