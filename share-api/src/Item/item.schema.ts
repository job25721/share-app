import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class Item {
  @Prop({ index: true, unique: true })
  name: string;
  @Prop({ index: true })
  description: string;
  @Prop({ index: true })
  category: string;
  @Prop({ index: true })
  tags: string[];
  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;
  @Prop()
  images: string[];
  @Prop()
  status: string;
  @Prop()
  createdDate: Date;
  @Prop({ type: Types.ObjectId, ref: 'ItemLog' })
  logId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  acceptedTo: Types.ObjectId | null;
}

export type ItemDocument = Item & Document;
export const ItemSchema = SchemaFactory.createForClass(Item);
