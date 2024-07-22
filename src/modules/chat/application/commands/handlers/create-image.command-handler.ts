import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateImageCommand } from '../impl/create-image.command';
import { Logger } from '@nestjs/common';
import { extension } from 'mime-types';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { writeFile } from 'fs/promises';

@CommandHandler(CreateImageCommand)
export class CreateImageCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(CreateImageCommandHandler.name);

  async execute(command: CreateImageCommand): Promise<string> {
    this.logger.debug(`Processing "${CreateImageCommand.name}"`);
    const { image } = command;

    const ext = extension(image.mimetype);
    const fileName = `${randomUUID()}.${ext}`;

    const storagePath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'public',
      fileName,
    );
    // console.log(storagePath);
    await writeFile(storagePath, image.buffer);
    return fileName;
  }
}
