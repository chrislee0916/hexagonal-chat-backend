import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ErrorMsg } from '../enums/err-msg.enum';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(ErrorMsg.ERR_COMMON_INVALID_OBJECT_ID);
    }
    return true;
  }
}
