import { MessageReadModel } from '../../domain/read-models/message.read-model';

export abstract class FindMessageRepository {
  abstract findList(): Promise<MessageReadModel[]>;
}
