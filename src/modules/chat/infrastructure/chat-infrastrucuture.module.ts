import { Module } from '@nestjs/common';
import { OrmChatPersistenceModule } from './persistence/orm/orm-persistence.module';

@Module({})
export class ChatInfrastrucutureModule {
  static use(driver: 'orm') {
    return {
      module: ChatInfrastrucutureModule,
      imports: [OrmChatPersistenceModule],
      exports: [OrmChatPersistenceModule],
    };
  }
}
