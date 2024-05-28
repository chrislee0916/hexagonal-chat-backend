import { ApiProperty } from '@nestjs/swagger';

// * 成功執行的返回格式
export class SuccessResponseDto {
  @ApiProperty({
    description: '是否成功',
    example: true,
  })
  readonly success: boolean;

  @ApiProperty({
    description: '返回資料',
    example: null,
  })
  readonly data: any;

  @ApiProperty({
    description: '花費時間(ms)',
    example: 123,
  })
  readonly runTimes: number;

  @ApiProperty({
    description: '完成執行時間',
    example: '2024-05-14T15:26:23+08:00',
  })
  readonly time: string;

  @ApiProperty({
    description: '完成執行時間戳',
    example: '1715671583858',
  })
  readonly timestamp: number;
}

// * 發生錯誤的返回格式
export class ErrorDetailResponseDto {
  @ApiProperty({
    description: '失敗訊息(debug mod 才會出現)',
  })
  readonly message: string | string[];
  @ApiProperty({
    description: '失敗原因種類',
  })
  readonly error?: string;
  @ApiProperty({
    description: '失敗狀態碼',
  })
  readonly statusCode?: number;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: '是否成功',
    example: false,
  })
  readonly success: boolean;

  @ApiProperty({
    description: '請求路徑',
    example: '/path/to/resource',
  })
  readonly path: string;

  @ApiProperty({
    description: '失敗詳細原因',
  })
  readonly detail: ErrorDetailResponseDto;

  @ApiProperty({
    description: '完成執行時間',
    example: '2024-05-14T15:26:23+08:00',
  })
  readonly time: string;

  @ApiProperty({
    description: '完成執行時間戳',
    example: '1715671583858',
  })
  readonly timestamp: number;
}
