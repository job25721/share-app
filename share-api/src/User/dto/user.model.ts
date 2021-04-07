import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class UserInfo {
  @Field(() => String)
  firstName: string;
  @Field(() => String)
  lastName: string;
  @Field(() => Date, { nullable: true })
  birthDate: Date;
  @Field(() => Number, { nullable: true })
  age: number;
}

@ObjectType()
export class User {
  @Field(() => ID)
  id?: string;
  @Field(() => String, { nullable: true })
  username: string;
  @Field(() => String, { nullable: true })
  password: string;
  @Field(() => String, { nullable: true })
  email: string;
  @Field(() => String, { nullable: true })
  avatar: string;
  @Field(() => UserInfo)
  info: UserInfo;
  @Field(() => String, { nullable: true })
  facebookId: string;
}

@ObjectType()
export class FindUserResponse {
  @Field(() => ID)
  id?: Types.ObjectId;
  @Field(() => String)
  avatar: string;
  @Field(() => UserInfo)
  info: UserInfo;
}
