import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dtos/response.dto';

export class GetFriendResponseDto {
  @ApiProperty({
    description: '使用者編號',
    example: 123,
  })
  readonly id: number;

  @ApiProperty({
    description: '使用者名稱',
    example: 'chris',
  })
  readonly name: string;

  @ApiProperty({
    description: '電子信箱',
    example: 'example@gmail.com',
  })
  readonly email: string;

  @ApiProperty({
    description: '使用者大頭貼',
    example: '/logo.png',
  })
  image: string;

  @ApiProperty({
    description: '建立時間',
    example: Date.now(),
  })
  createdAt: Date;

  @ApiProperty({
    description: '最後更新時間',
    example: Date.now(),
  })
  updatedAt: Date;
}

// * 成功取得好友列表返回結果
export class SuccessGetFriendsResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: [GetFriendResponseDto],
  })
  readonly data: GetFriendResponseDto[];
}
