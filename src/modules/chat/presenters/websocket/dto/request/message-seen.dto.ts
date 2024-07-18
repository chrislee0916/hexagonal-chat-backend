import { IsNumber } from 'class-validator';

export class MessageSeenDto {
  @IsNumber()
  chatroomId: number;
  @IsNumber()
  userId: number;
  @IsNumber()
  lastAckId: number;
}
