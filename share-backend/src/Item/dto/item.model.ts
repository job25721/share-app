import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class Item {
  @Field(() => ID)
  id?: Types.ObjectId;
  @Field(() => String)
  name: string;
  @Field(() => String)
  description: string;
  @Field(() => String)
  category: string;
  @Field(() => [String])
  tags: string[];
  @Field(() => String)
  ownerId: Types.ObjectId;
  @Field(() => [String])
  images: string[];
  @Field(() => String)
  status: string;
  @Field(() => Date)
  createdDate: Date;
  @Field(() => String)
  logId: Types.ObjectId | string;
  @Field(() => String, { nullable: true })
  acceptedTo: Types.ObjectId;
}
