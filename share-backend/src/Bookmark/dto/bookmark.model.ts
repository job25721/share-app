import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Item } from '../../Item/dto/item.model';

@ObjectType()
export class Bookmark {
  @Field(() => ID)
  id?: Types.ObjectId;
  @Field(() => String)
  userId: Types.ObjectId;
  @Field(() => [String])
  items: Types.ObjectId[];
}
