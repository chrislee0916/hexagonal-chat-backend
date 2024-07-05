import { Module } from '@nestjs/common';
import { OrmIamPersistenceModule } from './persistence/orm/orm-persistence.module';
import { BcryptModule } from './hashing/bcrypt/bcrypt.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisRefreshTokenIdsStorageModule } from './refresh-token-ids-storage/redis/redis-refresh-token-ids.storage.module';
import { SocketIOModule } from 'src/modules/chat/infrastructure/websocket/socketio/socketio.module';

@Module({})
export class IamInfrastructureModule {
  static use(driver: 'orm') {
    return {
      module: IamInfrastructureModule,
      imports: [
        OrmIamPersistenceModule,
        BcryptModule,
        RedisRefreshTokenIdsStorageModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
        }),
        SocketIOModule,
      ],
      exports: [
        OrmIamPersistenceModule,
        BcryptModule,
        RedisRefreshTokenIdsStorageModule,
        JwtModule,
        SocketIOModule,
      ],
    };
  }
}
