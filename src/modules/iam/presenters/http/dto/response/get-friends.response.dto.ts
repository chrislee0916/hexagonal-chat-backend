import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dtos/response.dto';
import { ObjectId } from 'mongodb';

export class GetUserResponseDto {
  @ApiProperty({
    description: 'objectId',
    example: new ObjectId('667518b4c5ca411ccfdbaa72'),
  })
  _id: ObjectId;

  @ApiProperty({
    description: '使用者編號',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '使用者名稱',
    example: 'name',
  })
  name: string;

  @ApiProperty({
    description: '使用者電子信箱',
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: '使用者大頭貼',
    example: 'logo.png',
  })
  image: string;

  @ApiProperty({
    description: '好友列表',
    example: [],
  })
  friends?: Pick<
    GetUserResponseDto,
    '_id' | 'id' | 'name' | 'email' | 'image'
  >[];

  @ApiProperty({
    description: '好友邀請列表',
    example: [],
  })
  askFriends?: Pick<
    GetUserResponseDto,
    '_id' | 'id' | 'name' | 'email' | 'image'
  >[];

  @ApiProperty({
    description: '建立時間',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: '最後更新時間',
    example: new Date(),
  })
  updatedAt: Date;
}

// * 成功取得使用者資料返回結果
export class SuccessGetUserResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: GetUserResponseDto,
    example: GetUserResponseDto,
  })
  readonly data: GetUserResponseDto;
}
