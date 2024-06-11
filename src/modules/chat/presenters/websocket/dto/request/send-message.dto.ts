import { IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  chatroomId: number;
  @IsString()
  content: string;
}
