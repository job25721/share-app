import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class Tag {
  @Prop()
  name: string;
  @Prop()
  usedFreq: number;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  addedBy: Types.ObjectId;
}

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);
