import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateChatroomDto } from './dto/request/create-chatroom.dto';
import { ChatService } from '../../application/chat.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { CreateChatroomCommand } from '../../application/commands/impl/create-chatroom.command';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/domain/interfaces/active-user-data.interface';
import {
  CreateChatroomResponseDto,
  SuccessCreateChatroomResponseDto,
} from './dto/response/create-chatroom.response.dto';

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
    summary: '建立聊天室',
  })
  @ApiBody({
    type: CreateChatroomDto,
  })
  @ApiCreatedResponse({
    type: SuccessCreateChatroomResponseDto,
  })
  @Post('chatroom')
  async createChatroom(
    @ActiveUser() user: ActiveUserData,
    @Body() createChatroomDto: CreateChatroomDto,
  ): Promise<CreateChatroomResponseDto> {
    // const lastChatId = this.chats.length;
    // const newChat = {
    //   id: `${lastChatId + 1}`,
    //   createdAt: new Date(),
    //   lastMessageAt: new Date(),
    //   name: `chatname${lastChatId + 1}`,
    //   isGroup: false,
    //   messagesIds: ['3', '4'],
    //   messages: [
    //     {
    //       id: '3',
    //       body: 'hello, world1',
    //       createdAt: new Date(),
    //       seen: [],
    //       sender: this.user2,
    //     },
    //     {
    //       id: '4',
    //       body: 'hello, world2',
    //       image: '/images/logo.png',
    //       createdAt: new Date(),
    //       seen: [],
    //       sender: this.user2,
    //     },
    //   ],
    //   userIds: ['1', '2'],
    //   users: [this.user1, this.user2],
    // };
    // this.chats.unshift(newChat);

    return this.chatService.createChatroom(
      new CreateChatroomCommand(createChatroomDto.name, [
        user.sub,
        ...createChatroomDto.userIds,
      ]),
    );
  }

  @Get('chatrooms')
  async findAll() {
    // const chats = [
    //   {
    //     id: '1',
    //     createdAt: new Date(),
    //     lastMessageAt: new Date(),
    //     name: 'chatname1',
    //     isGroup: false,
    //     messagesIds: ['1', '2'],
    //     messages: [
    //       {
    //         id: '1',
    //         body: 'hello, world1',
    //         createdAt: new Date(),
    //         seen: [],
    //         sender: this.user2,
    //       },
    //       {
    //         id: '2',
    //         body: 'hello, world2',
    //         image: '/images/logo.png',
    //         createdAt: new Date(),
    //         seen: [],
    //         sender: this.user2,
    //       },
    //     ],
    //     userIds: ['1', '2', '3'],
    //     users: [this.user1, this.user2, this.user3],
    //   },
    // ];
    return this.chats;
  }

  @Get('chatroom/:id')
  async findOne() {
    return {
      id: '1',
      createdAt: new Date(),
      lastMessageAt: new Date(),
      name: 'chatname1',
      isGroup: true,
      userIds: ['1', '2', '3'],
      users: [this.user1, this.user2, this.user3],
    };
  }

  @Delete('chatroom/:id')
  async remove(@Param('id') id: string) {
    this.chats = this.chats.filter((chat) => chat.id !== id);
  }

  @Get('messages')
  async findAllMessages() {
    const user1 = {
      id: '1',
      name: 'ChrisLee',
      email: 'hsinda456@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user2 = {
      id: '2',
      name: 'username2',
      email: 'user2@email.com',
      image: '/images/logo.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user3 = {
      id: '3',
      name: 'username3',
      email: 'user3@email.com',
      image: '/images/logo.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return [
      {
        id: '1',
        body: 'hello, world1',
        createdAt: new Date(),
        seen: [],
        sender: user2,
      },
      {
        id: '2',
        body: 'hello, world2',
        image: '/images/logo.png',
        createdAt: new Date(),
        seen: [user2],
        sender: user1,
      },
    ];
  }
}
