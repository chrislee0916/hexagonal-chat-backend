import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  chatroomId: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  content: string;
}
