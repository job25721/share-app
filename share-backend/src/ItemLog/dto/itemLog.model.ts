import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class Log {
  @Field(() => Date)
  timestamp: Date;
  @Field(() => String)
  actor: Types.ObjectId | string;
  @Field(() => String)
  action: string;
  @Field(() => String)
  hash: string;
  @Field(() => String, { nullable: true })
  prevHash: string;
}

@ObjectType()
export class ItemLog {
  @Field(() => ID)
  id?: string;
  @Field(() => String)
  itemId: Types.ObjectId | string;
  @Field(() => [Log])
  logs: Log[];
}
