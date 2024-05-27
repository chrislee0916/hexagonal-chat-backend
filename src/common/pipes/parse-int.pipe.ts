import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { ErrorMsg } from '../enums/err-msg.enum';

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(ErrorMsg.ERR_COMMON_PARAM_NOT_INT);
    }
    return val;
  }
}
