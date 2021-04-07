import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class Tag {
  @Field(() => ID)
  id?: Types.ObjectId;
  @Field(() => String)
  name: string;
  @Field(() => Number)
  usedFreq: number;
  @Field(() => String)
  addedBy: Types.ObjectId;
}
