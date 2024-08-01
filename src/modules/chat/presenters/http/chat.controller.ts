import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
  ErrorUserNotFoundResponseDto,
  SuccessCreateChatroomResponseDto,
} from './dto/response/create-chatroom.response.dto';
import { FindOneChatroomQuery } from '../../application/querys/impl/find-one-chatroom.query';
import { Request } from 'express';
import { DefaultListQueryDto } from 'src/common/dtos/request.dto';
import { FindListMessageQuery } from '../../application/querys/impl/find-list-message.query';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/request/create-image.dto';
import { writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { extension } from 'mime-types';
import { randomUUID } from 'crypto';
import { CreateImageCommand } from '../../application/commands/impl/create-image.command';
import { SuccessCreateImageResponseDto } from './dto/response/create-image.response.dto';
import {
  ErrorChatroomNotFoundResponseDto,
  ShowChatroomResponseDto,
} from './dto/response/find-one-chatroom.response.dto';
import {
  FindListMessageResponseDto,
  SuccessFindListMessageResponseDto,
} from './dto/response/find-list-message.response.dto';

@Auth(AuthType.Bearer)
@ApiTags('CHAT - 即時通訊服務')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
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
  @ApiNotFoundResponse({
    type: ErrorUserNotFoundResponseDto,
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

  @Post('image')
  @Auth(AuthType.None)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上傳檔案',
    type: CreateImageDto,
  })
  @ApiCreatedResponse({
    type: SuccessCreateImageResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async createImage(@UploadedFile() image: Express.Multer.File) {
    return this.chatService.createImage(new CreateImageCommand(image));
  }

  @Get('chatroom/:id')
  @ApiOkResponse({
    type: ShowChatroomResponseDto,
  })
  @ApiNotFoundResponse({
    type: ErrorChatroomNotFoundResponseDto,
  })
  async findOne(@Param('id') id: number) {
    return this.chatService.findOneChatroom(new FindOneChatroomQuery(id));
  }

  @Get('chatroom/:id/messages')
  @Auth(AuthType.None)
  @ApiOkResponse({
    type: SuccessFindListMessageResponseDto,
  })
  async findAllMessages(
    @Param('id') id: number,
    @Query() query: DefaultListQueryDto,
  ) {
    return this.chatService.findListMessage(
      new FindListMessageQuery(id, query.limit, query.skip, query.sort),
    );
  }
}
