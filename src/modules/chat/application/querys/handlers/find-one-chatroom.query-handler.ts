import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneChatroomQuery } from '../impl/find-one-chatroom.query';
import { Logger } from '@nestjs/common';
import { FindMaterializedChatroomRepository } from '../../ports/find-materialized-chatroom.repository';

@QueryHandler(FindOneChatroomQuery)
export class FindOneChatroomQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(FindOneChatroomQueryHandler.name);

  constructor(
    private readonly findChatroomRepository: FindMaterializedChatroomRepository,
  ) {}

  async execute(query: FindOneChatroomQuery): Promise<any> {
    this.logger.debug(
      `Processing "${FindOneChatroomQuery.name}": ${JSON.stringify(query)}`,
    );
    return this.findChatroomRepository.findOne(query.id);
  }
}
