import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ChatMessage } from './dto/chat.model';

@Schema()
class Chat {
  @Prop()
  data: ChatMessage[];
  @Prop()
  active: boolean;
  @Prop({ type: Types.ObjectId, ref: 'Item' })
  for: Types.ObjectId;
  @Prop()
  lastestUpdate: number;
}

export type ChatDocument = Chat & Document;
export const ChatSchema = SchemaFactory.createForClass(Chat);
