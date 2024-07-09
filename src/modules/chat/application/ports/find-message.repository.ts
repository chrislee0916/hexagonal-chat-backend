import { MessageReadModel } from '../../domain/read-models/message.read-model';
import { FindListMessageQuery } from '../querys/impl/find-list-message.query';

export abstract class FindMessageRepository {
  abstract findList(query: FindListMessageQuery): Promise<MessageReadModel[]>;
}
