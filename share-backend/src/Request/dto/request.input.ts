import { Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class RequestInput {
  @Field(() => String)
  itemId: string;
  @Field(() => String)
  reason: string;
  @Field(() => Number)
  wantedRate: number;
}

@InputType()
export class RequestActivityDto {
  @Field(() => String)
  reqId: Types.ObjectId;
}
