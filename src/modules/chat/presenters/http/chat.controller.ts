import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateChatroomDto } from './dto/request/create-chatroom.dto';
import { ChatService } from '../../application/chat.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { CreateChatroomCommand } from '../../application/commands/impl/create-chatroom.command';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/domain/interfaces/active-user-data.interface';

@ApiTags('CHAT - 即時通訊服務')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: '建立聊天室',
  })
  @Post('chatroom')
  async createChatroom(
    @ActiveUser() user: ActiveUserData,
    @Body() createChatroomDto: CreateChatroomDto,
  ) {
    return this.chatService.createChatroom(
      new CreateChatroomCommand(createChatroomDto.name, [
        user.sub,
        ...createChatroomDto.userIds,
      ]),
    );
  }
}
