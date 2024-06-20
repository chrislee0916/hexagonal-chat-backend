import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { ErrorMsg } from '../enums/err-msg.enum';
import { isEmail } from 'class-validator';

@Injectable()
export class IsEmailPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    // const val = parseInt(value, 10);
    if (!isEmail(value)) {
      throw new BadRequestException(ErrorMsg.ERR_COMMON_PARAM_NOT_EMAIL);
    }
    return value;
  }
}
