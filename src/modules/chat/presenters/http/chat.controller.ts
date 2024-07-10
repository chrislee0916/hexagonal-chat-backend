import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateGroupChatroomDto,
  CreateSingleChatroomDto,
} from './dto/request/create-chatroom.dto';
import { ChatService } from '../../application/chat.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import {
  CreateGroupChatroomCommand,
  CreateSingleChatroomCommand,
} from '../../application/commands/impl/create-chatroom.command';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/domain/interfaces/active-user-data.interface';
import {
  CreateChatroomResponseDto,
  SuccessCreateChatroomResponseDto,
} from './dto/response/create-chatroom.response.dto';
import { FindOneChatroomQuery } from '../../application/querys/impl/find-one-chatroom.query';
import { Request } from 'express';
import { DefaultListQueryDto } from 'src/common/dtos/request.dto';
import { FindListMessageQuery } from '../../application/querys/impl/find-list-message.query';

@Auth(AuthType.Bearer)
@ApiTags('CHAT - 即時通訊服務')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  private user1 = {
    id: '1',
    name: 'ChrisLee',
    email: 'hsinda456@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  private user2 = {
    id: '2',
    name: 'username2',
    email: 'user2@email.com',
    image: '/images/logo.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  private user3 = {
    id: '3',
    name: 'username3',
    email: 'user3@email.com',
    image: '/images/logo.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  private chats = [
    {
      id: '1',
      createdAt: new Date(),
      lastMessageAt: new Date(),
      name: 'chatname1',
      isGroup: false,
      messagesIds: ['1', '2'],
      messages: [
        {
          id: '1',
          body: 'hello, world1',
          createdAt: new Date(),
          seen: [],
          sender: this.user2,
        },
        {
          id: '2',
          body: 'hello, world2',
          image: '/images/logo.png',
          createdAt: new Date(),
          seen: [],
          sender: this.user2,
        },
      ],
      userIds: ['1', '2', '3'],
      users: [this.user1, this.user2, this.user3],
    },
  ];
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: '建立群組聊天室',
  })
  @ApiBody({
    type: CreateGroupChatroomDto,
  })
  @ApiCreatedResponse({
    type: SuccessCreateChatroomResponseDto,
  })
  @Post('group-chatroom')
  async createGroupChatroom(
    @ActiveUser() user: ActiveUserData,
    @Body() createGroupChatroomDto: CreateGroupChatroomDto,
  ): Promise<CreateChatroomResponseDto> {
    return this.chatService.createGroupChatroom(
      new CreateGroupChatroomCommand(createGroupChatroomDto.name, [
        user.sub,
        ...createGroupChatroomDto.userIds,
      ]),
    );
  }

  // @Post('single-chatroom')
  // @ApiOperation({
  //   summary: '建立一對一聊天室',
  // })
  // @ApiBody({
  //   type: CreateSingleChatroomDto,
  // })
  // @ApiCreatedResponse({
  //   type: SuccessCreateChatroomResponseDto,
  // })
  // async createSingleChatroom(
  //   @ActiveUser() user: ActiveUserData,
  //   @Body() createSingleChatroomDto: CreateSingleChatroomDto,
  // ) {
  //   return this.chatService.createSingleChatroom(
  //     new CreateSingleChatroomCommand(
  //       createSingleChatroomDto.name,
  //       user.sub,
  //       createSingleChatroomDto.userId,
  //     ),
  //   );
  // }

  @Get('chatroom/:id')
  async findOne(@Param('id') id: number) {
    return this.chatService.findOneChatroom(new FindOneChatroomQuery(id));
  }

  @Delete('chatroom/:id')
  async remove(@Param('id') id: string) {
    this.chats = this.chats.filter((chat) => chat.id !== id);
  }

  @Get('chatroom/:id/messages')
  @Auth(AuthType.None)
  async findAllMessages(
    @Param('id') id: number,
    @Query() query: DefaultListQueryDto,
  ) {
    return this.chatService.findListMessage(
      new FindListMessageQuery(id, query.limit, query.skip, query.sort),
    );
  }
}
