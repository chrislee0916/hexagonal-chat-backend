import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MessageBodyPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      return Object.assign(
        Object.create(metadata.metatype.prototype),
        JSON.parse(value),
      );
    }
    return value;
  }
}
