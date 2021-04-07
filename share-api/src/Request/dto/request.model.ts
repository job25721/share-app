import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class Request {
  @Field(() => ID)
  id?: string;
  @Field(() => String)
  itemId: Types.ObjectId | string;
  @Field(() => String)
  requestPersonId: Types.ObjectId;
  @Field(() => String)
  requestToPersonId: Types.ObjectId;
  @Field(() => Date)
  timestamp: Date;
  @Field(() => String)
  reason: string;
  @Field(() => Number)
  wantedRate: number;
  @Field(() => String)
  status: string;
  @Field(() => String)
  chat_uid: Types.ObjectId;
}

@ObjectType()
export class RequestUpdatedNotify {
  @Field(() => String)
  notifyTo: string;
  @Field(() => Request)
  request: Request;
}
