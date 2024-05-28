import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateChatroomDto } from './dto/request/create-chatroom.dto';
import { ChatService } from '../../application/chat.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { CreateChatroomCommand } from '../../application/commands/impl/create-chatroom.command';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: '建立聊天室',
  })
  @Post('chatroom')
  async createChatroom(@Body() createChatroomDto: CreateChatroomDto) {
    return this.chatService.createChatroom(
      new CreateChatroomCommand(
        createChatroomDto.name,
        createChatroomDto.userIds,
      ),
    );
  }
}
