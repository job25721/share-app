import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserInfo } from './dto/user.model';

@Schema()
class User {
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  email: string;
  @Prop()
  avatar: string;
  @Prop()
  info: UserInfo;
  @Prop()
  facebookId: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
