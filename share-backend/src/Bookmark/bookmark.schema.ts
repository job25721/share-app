import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Types, Document } from 'mongoose';
import { Item } from '../Item/dto/item.model';

@Schema()
class Bookmark {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], ref: 'Item' })
  items: Types.ObjectId[];
}

export type BookmarkDocument = Bookmark & Document;
export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
