import { Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Item } from '../../Item/dto/item.model';

@InputType()
export class BookmarkInput {
  @Field(() => String)
  userId: Types.ObjectId;
  @Field(() => String)
  itemId: Types.ObjectId;
}
