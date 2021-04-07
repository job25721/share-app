import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class ChatMessage {
  @Field(() => String)
  from: string;
  @Field(() => String)
  to: string;
  @Field(() => String)
  message: string;
  @Field(() => Date)
  timestamp: Date;
  @Field(() => Boolean)
  hasReaded: boolean;
}

@ObjectType()
export class Chat {
  @Field(() => ID)
  id?: Types.ObjectId;
  @Field(() => [ChatMessage])
  data: ChatMessage[];
  @Field(() => Boolean)
  active: boolean;
  @Field(() => String)
  for: Types.ObjectId;
  @Field(() => Number)
  lastestUpdate: number;
}

@ObjectType()
export class ChatSocketResponse {
  @Field(() => String)
  chatRoomId: string;
  @Field(() => String)
  itemId: string;
  @Field(() => String)
  requestId: string;
  @Field(() => String)
  from: string;
  @Field(() => String)
  message: string;
  @Field(() => String)
  to: string;
  @Field(() => Date)
  timestamp: Date;
  @Field(() => Boolean)
  hasReaded: boolean;
}
