export class CreateImageCommand {
  constructor(public readonly image: Express.Multer.File) {}
}
