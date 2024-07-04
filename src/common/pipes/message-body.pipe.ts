import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MessageBodyPipe implements PipeTransform<object> {
  async transform(value: object, metadata: ArgumentMetadata) {
    // console.log('metadata.metatype: ', metadata.metatype);
    if (metadata.type === 'body') {
      return Object.assign(Object.create(metadata.metatype.prototype), value);
    }
    return value;
  }
}
