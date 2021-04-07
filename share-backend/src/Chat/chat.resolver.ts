import { UseGuards } from '@nestjs/common';
import {
  Args,
  Resolver,
  Query,
  ResolveField,
  Parent,
  Context,
  Subscription,
  Mutation,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Item } from 'src/Item/dto/item.model';
import { ItemService } from 'src/Item/item.service';
import { RequestService } from 'src/Request/request.service';
import { AuthGuard } from 'src/User/auth.guard';
import { User } from 'src/User/dto/user.model';
import { ChatService } from './chat.service';
import { MessagePayload } from './dto/chat.input';
import { Chat, ChatMessage, ChatSocketResponse } from './dto/chat.model';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly requestService: RequestService,
  ) {}

  @UseGuards(new AuthGuard())
  @Query(() => [Chat])
  async getMyChat(@Context('user') user): Promise<Chat[]> {
    const myReq = await this.requestService.findMyRequests(user.id);
    const mySendReq = await this.requestService.findMySendRequests(user.id);
    const myChat = [
      ...myReq.map(({ chat_uid }) => chat_uid),
      ...mySendReq.map(({ chat_uid }) => chat_uid),
    ];
    return this.chatService.findChat(myChat);
  }

  @Query(() => Chat)
  async getChatById(@Args('chatRoomId') chatRoomId: string): Promise<Chat> {
    return this.chatService.findById(Types.ObjectId(chatRoomId));
  }

  @UseGuards(new AuthGuard())
  @Mutation(() => Chat)
  async updateChatToReadAll(
    @Context('user') user,
    @Args('chatRoomid') chatRoomId: string,
  ): Promise<Chat> {
    return this.chatService.updateToReadAll(chatRoomId, user.id);
  }

  @UseGuards(new AuthGuard())
  @Mutation(() => ChatMessage)
  async sendMessage(
    @Context('user') user,
    @Args('chatRoomId') chatRoomId: string,
    @Args('messagePayload') messagePayload: MessagePayload,
  ): Promise<ChatMessage> {
    try {
      const validateChat = await this.requestService.validateChatWithUserId(
        chatRoomId,
        user.id,
      );
      if (!validateChat) {
        throw new Error("you're isn't own this chat or no chat");
      }
      return this.chatService.sendMessage({ chatRoomId, messagePayload });
    } catch (err) {
      return err;
    }
  }

  @Subscription(() => ChatSocketResponse)
  // @UseGuards(() => new AuthGuard())
  newDirectMessage(): AsyncIterator<ChatSocketResponse> {
    return this.chatService.newDirectMessage();
  }
}
