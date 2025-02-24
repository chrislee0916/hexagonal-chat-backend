import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneChatroomQuery } from '../impl/find-one-chatroom.query';
import { Logger, NotFoundException } from '@nestjs/common';
import { FindMaterializedChatroomRepository } from '../../ports/find-materialized-chatroom.repository';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

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
    const res = await this.findChatroomRepository.findOne(query.id);
    if (!res) {
      throw new NotFoundException(ErrorMsg.ERR_CHAT_ROOM_NOT_FOUND);
    }
    return res;
  }
}
