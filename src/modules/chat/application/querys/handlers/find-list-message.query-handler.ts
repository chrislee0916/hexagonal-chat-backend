import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { FindMessageRepository } from '../../ports/find-message.repository';
import { FindListMessageQuery } from '../impl/find-list-message.query';

@QueryHandler(FindListMessageQuery)
export class FindListMessageQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(FindListMessageQueryHandler.name);

  constructor(private readonly findMessageRepository: FindMessageRepository) {}

  async execute(query: FindListMessageQuery): Promise<any> {
    this.logger.debug(
      `Processing a"${FindListMessageQuery.name}": ${JSON.stringify(query)}`,
    );
    return this.findMessageRepository.findList(query);
  }
}
