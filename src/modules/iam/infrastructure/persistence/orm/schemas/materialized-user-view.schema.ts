import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class MaterializedUserView {
  @Prop({
    unique: true,
    index: true,
  })
  id: number;

  @Prop()
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  email: string;
}

export const MaterializedUserViewSchema =
  SchemaFactory.createForClass(MaterializedUserView);
