import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { SignUpDto } from 'src/modules/iam/presenters/http/dto/sign-up.dto';
import { ErrorMsg } from '../enums/err-msg.enum';

@Injectable()
export class PasswordConfirmedPipe implements PipeTransform {
  transform(value: SignUpDto, metadata: ArgumentMetadata) {
    if (value.password !== value.password_confirmed) {
      throw new BadRequestException(
        ErrorMsg.ERR_AUTH_SIGNUP_PASSWORD_CONFIRMED,
      );
    }
    return value;
  }
}
