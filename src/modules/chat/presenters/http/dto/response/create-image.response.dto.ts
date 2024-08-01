import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dtos/response.dto';

// * 成功上傳圖片返回結果

export class SuccessCreateImageResponseDto extends SuccessResponseDto {
  @ApiProperty({
    type: String,
    example: 'eec8e436-0678-4464-9044-631f8a374b6a.png',
  })
  readonly data: string;
}
