import { Field, InputType } from '@nestjs/graphql';

@InputType()
class newUserInfo {
  @Field(() => String)
  firstName: string;
  @Field(() => String)
  lastName: string;
  @Field(() => Date, { nullable: true })
  birthDate?: Date;
  @Field(() => Number, { nullable: true })
  age?: number;
}

@InputType()
export class NewUser {
  @Field(() => String)
  username?: string;
  @Field(() => String)
  password?: string;
  @Field(() => String, { nullable: true })
  email: string;
  @Field(() => String, { nullable: true })
  avatar: string;
  @Field(() => newUserInfo, { nullable: true })
  info: newUserInfo;
  @Field(() => String)
  facebookId?: string;
}
