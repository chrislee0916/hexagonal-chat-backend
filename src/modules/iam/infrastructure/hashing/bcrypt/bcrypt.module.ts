import { Module } from '@nestjs/common';
import { HashingService } from 'src/modules/iam/application/ports/hashing.service';
import { BcryptService } from './bcrypt.service';

@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [HashingService],
})
export class BcryptModule {}
