import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;
}
