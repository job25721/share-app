import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MessagePayload {
  @Field(() => String)
  from: string;
  @Field(() => String)
  to: string;
  @Field(() => String)
  message: string;
  @Field(() => Date)
  timestamp: Date;
}

@InputType()
export class SendMessage {
  @Field(() => String)
  chatRoomId: string;
  @Field(() => MessagePayload)
  messagePayload: MessagePayload;
}
