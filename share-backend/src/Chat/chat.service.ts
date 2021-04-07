import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PubSub } from 'apollo-server-express';
import { Model, Types } from 'mongoose';
import { RequestService } from 'src/Request/request.service';
import { ChatDocument } from './chat.schema';
import { SendMessage } from './dto/chat.input';
import { Chat, ChatMessage, ChatSocketResponse } from './dto/chat.model';

@Injectable()
export class ChatService {
  private pubSub: PubSub;
  constructor(
    @InjectModel('Chat') private chatModel: Model<ChatDocument>,
    private readonly requestService: RequestService,
  ) {
    this.pubSub = new PubSub();
  }

  async create(itemId: Types.ObjectId): Promise<Chat> {
    const chatRoomData: Chat = {
      data: [],
      active: true,
      lastestUpdate: Date.now(),
      for: itemId,
    };
    const newChatRoom = new this.chatModel(chatRoomData);
    return newChatRoom.save();
  }

  async updateReqId(chat_uid: Types.ObjectId, itemId: string): Promise<Chat> {
    const chat = await this.chatModel.findById(chat_uid);
    chat.for = Types.ObjectId(itemId);
    return chat.save();
  }

  async disableManyChatByReqId(
    itemId: Types.ObjectId,
    activeChat_uid: Types.ObjectId,
  ): Promise<void> {
    await this.chatModel.updateMany(
      { for: itemId, $nor: [{ _id: activeChat_uid }] },
      { active: false },
    );
  }

  async disableChat(queryData: { chatUid: Types.ObjectId }): Promise<void> {
    try {
      const { chatUid } = queryData;
      const chat = await this.chatModel.findById(chatUid);
      if (chat === null) throw new Error('no this chat id');
      chat.active = false;
      await chat.save();
    } catch (err) {
      return err.message;
    }
  }

  async findById(chat_uid: Types.ObjectId): Promise<Chat> {
    return this.chatModel.findById(chat_uid);
  }

  async findChat(chatUid: Types.ObjectId[]): Promise<Chat[]> {
    return this.chatModel.find({
      _id: { $in: chatUid },
    });
  }

  async updateToReadAll(chat_uid: string, userId): Promise<Chat> {
    try {
      const chat = await this.chatModel.findById(Types.ObjectId(chat_uid));
      if (!chat) {
        throw new Error('no chat id');
      }
      chat.data = chat.data.map((data) =>
        data.to === userId ? { ...data, hasReaded: true } : data,
      );
      return chat.save();
    } catch (error) {
      return error;
    }
  }

  async addMessage(queryData: {
    chatUid: Types.ObjectId;
    payload: ChatMessage;
  }): Promise<Chat> {
    try {
      const chat = await this.chatModel.findById(queryData.chatUid);
      if (chat === null) throw new Error('no this chat id');
      chat.lastestUpdate = Date.now();
      chat.data = [...chat.data, queryData.payload];
      return chat.save();
    } catch (err) {
      return err;
    }
  }

  async sendMessage(payload: SendMessage): Promise<ChatMessage> {
    const { chatRoomId, messagePayload } = payload;
    try {
      const chat = await this.chatModel.findById(chatRoomId);
      console.log(chat);

      if (chat === null) throw new Error('no chat room');
      else if (!chat.active) throw new Error('chat is inactive');

      chat.data = [...chat.data, { ...messagePayload, hasReaded: false }];
      chat.lastestUpdate = chat.data[chat.data.length - 1].timestamp.getTime();
      await chat.save();
      const { id } = await this.requestService.findByChat(chat.id);
      const ChatSocketResponse: ChatSocketResponse = {
        chatRoomId,
        ...messagePayload,
        itemId: chat.for.toHexString().toString(),
        requestId: id,
        hasReaded: false,
      };
      this.pubSub.publish('newDirectMessage', {
        newDirectMessage: ChatSocketResponse,
      });
      return { ...payload.messagePayload, hasReaded: false };
    } catch (err) {
      console.log(err);

      return err;
    }
  }

  newDirectMessage(): AsyncIterator<ChatSocketResponse> {
    return this.pubSub.asyncIterator<ChatSocketResponse>('newDirectMessage');
  }
}
