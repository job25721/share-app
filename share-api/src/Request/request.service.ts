import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItemService } from '../Item/item.service';
import { itemStatus, requestStatus } from '../status';
import { ItemLogService } from '../ItemLog/itemLog.service';
import { UserService } from '../User/user.service';
import { RequestActivityDto } from './dto/request.input';
import { Request, RequestUpdatedNotify } from './dto/request.model';
import { RequestDocument } from './request.schema';
import { ChatService } from 'src/Chat/chat.service';
import { PubSub } from 'apollo-server-express';
@Injectable()
export class RequestService {
  private pubSub: PubSub;
  constructor(
    @InjectModel('Request') private requestModel: Model<RequestDocument>,
    private readonly itemLogService: ItemLogService,
    private readonly itemService: ItemService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {
    this.pubSub = new PubSub();
  }

  async addRequest(data: {
    itemId: string;
    requestPersonId: string;
    reason: string;
    wantedRate: number;
  }): Promise<Request> {
    const { reason, wantedRate } = data;
    const itemId = Types.ObjectId(data.itemId);
    const requestPersonId = Types.ObjectId(data.requestPersonId);

    try {
      //find exist request
      const existRequest = await this.requestModel.findOne({
        itemId: itemId,
        requestPersonId: requestPersonId,
      });

      console.log(existRequest);

      if (
        existRequest === null ||
        existRequest.status === requestStatus.rejected
      ) {
        const item = await this.itemService.findById(itemId);

        if (
          item.ownerId.toHexString().toString() ===
          requestPersonId.toHexString().toString()
        ) {
          throw new Error("can't request your own item");
        }
        if (item.status !== itemStatus.available) {
          throw new Error("item is not available can't request !!");
        }

        const receiver = await this.userService.findById(requestPersonId);
        const newChat = await this.chatService.create(itemId);
        await this.chatService.addMessage({
          chatUid: newChat.id,
          payload: {
            from: requestPersonId.toHexString().toString(),
            to: item.ownerId.toHexString().toString(),
            message: `${receiver.info.firstName} ได้ส่งคำขอ ${item.name} ของคุณ\nเหตุผล : ${reason}\nระดับความต้องการ ${wantedRate}`,
            timestamp: new Date(Date.now()),
            hasReaded: false,
          },
        });
        const reqDto: Request = {
          itemId,
          requestPersonId,
          requestToPersonId: item.ownerId,
          timestamp: new Date(Date.now()),
          reason,
          wantedRate,
          status: requestStatus.requested,
          chat_uid: new Types.ObjectId(newChat.id),
        };

        const newRequest = new this.requestModel(reqDto);

        await this.itemLogService.addLog({
          itemId,
          actorId: requestPersonId,
          action: `${receiver.info.firstName} ทำการรีเควสของชิ้นนี้ reqid:${newRequest.id}`,
        });
        await newRequest.save();
        this.pubSub.publish('newRequest', { newRequest });
        return newRequest;
      } else {
        throw new Error(`you has exist request an item ${itemId}`);
      }
    } catch (err) {
      console.log(err);

      return err;
    }
  }

  async findById(reqId: string): Promise<Request> {
    try {
      const res = await this.requestModel.findById(reqId);
      if (res === null) throw new Error('No request');
      return res;
    } catch (err) {
      return err;
    }
  }

  async findByChat(chat_uid: string): Promise<Request> {
    return this.requestModel.findOne({ chat_uid: Types.ObjectId(chat_uid) });
  }

  async findMyRequests(myId: string): Promise<Request[]> {
    return this.requestModel.find({
      requestToPersonId: Types.ObjectId(myId),
    });
  }

  async findMySendRequests(requestPersonId: string): Promise<Request[]> {
    return this.requestModel.find({
      requestPersonId: Types.ObjectId(requestPersonId),
    });
  }

  async findMySuccessRequests(userId): Promise<Request[]> {
    return (await this.findMySendRequests(userId)).filter(
      (request) => request.status === requestStatus.delivered,
    );
  }

  async acceptRequest(data: RequestActivityDto, actorId): Promise<Request> {
    const reqId = data.reqId;
    const actionPersonId = actorId;

    try {
      const req = await this.requestModel.findById(reqId);
      const { itemId, requestPersonId } = req;
      const { ownerId, status } = await this.itemService.findById(itemId);
      if (ownerId === undefined) throw new Error('no this request id');

      if (ownerId.toHexString().toString() !== actionPersonId.toString()) {
        throw new Error('accept person is not item owner');
      }
      if (status !== itemStatus.available) {
        throw new Error(
          "can't accept this request because request is already accepted or item is not available",
        );
      }

      if (req.status !== requestStatus.requested) {
        throw new Error('this request already rejected or accepted');
      }

      const giver = await this.userService.findById(actionPersonId);
      const receiver = await this.userService.findById(requestPersonId);
      req.status = requestStatus.accepted;
      await req.save();
      await this.chatService.sendMessage({
        chatRoomId: req.chat_uid.toHexString().toString(),
        messagePayload: {
          from: giver.id,
          to: receiver.id,
          message: `นี่เป็นข้อความอัตฺโนมัติ :  ${giver.info.firstName} ได้ยินยอมส่งต่อของชิ้นนี้ให้คุณ โปรดนัดรับสิ้นค้ากันผ่านแชทนี้\nเมื่อคุณได้รับของและกดยืนยันรับของในปุ่มข้างล่าง แชทนี้จะถูกปิดทันที โปรดมั่นใจว่าคุณได้รับแล้วจึงกด`,
          timestamp: new Date(),
        },
      });
      await this.requestModel.updateMany(
        { itemId, status: requestStatus.requested },
        { status: requestStatus.rejected },
      );
      await this.chatService.disableManyChatByReqId(itemId, req.chat_uid);
      await this.itemLogService.addLog({
        itemId: itemId,
        actorId: actionPersonId,
        action: `${giver.info.firstName} ได้ยินยอมส่งต่อของให้ ${receiver.info.firstName}`,
      });
      await this.itemService.changeItemStatus({
        itemId,
        status: itemStatus.accepted,
      });
      await this.itemService.updateAcceptedToPerson(itemId, requestPersonId);

      await this.pubSub.publish('requestUpdated', {
        requestUpdated: { request: req, notifyTo: receiver.id },
      });
      return req;
    } catch (err) {
      return err;
    }
  }

  async acceptDelivered(data: RequestActivityDto, actorId): Promise<Request> {
    const reqId = data.reqId;
    const actionPersonId = actorId;

    try {
      const req = await this.requestModel.findById(reqId);

      const { itemId, requestPersonId, requestToPersonId, chat_uid } = req;

      if (
        actionPersonId.toString() !==
        req.requestPersonId.toHexString().toString()
      ) {
        throw new Error("You're not a request person");
      }
      if (req.status !== requestStatus.accepted) {
        throw new Error('this request is not accept by owner');
      }

      const giver = await this.userService.findById(requestToPersonId);
      const receiver = await this.userService.findById(requestPersonId);

      await this.itemLogService.addLog({
        itemId: itemId,
        actorId: actionPersonId,
        action: `${receiver.info.firstName} ได้รับของจาก ${giver.info.firstName} แล้ว สิ้นสุดกระบวนการ SHARE`,
      });

      await this.chatService.sendMessage({
        chatRoomId: chat_uid.toHexString().toString(),
        messagePayload: {
          from: receiver.id,
          to: giver.id,
          message: `นี่เป็นข้อความอัตโนมัติ : ${receiver.info.firstName} ได้รับของคุณเรียบร้อย ห้องแชทได้ถูกปิด\nคุณไม่สามารถส่งข้อความหากันได้อีกต่อไป`,
          timestamp: new Date(),
        },
      });

      await this.chatService.disableChat({ chatUid: chat_uid });

      req.status = requestStatus.delivered;
      await this.itemService.changeItemStatus({
        itemId,
        status: itemStatus.delivered,
      });
      await req.save();
      await this.pubSub.publish('requestUpdated', {
        requestUpdated: { request: req, notifyTo: giver.id },
      });
      return req;
    } catch (err) {
      console.log(err);

      return err;
    }
  }

  async rejectRequest(data: RequestActivityDto, actorId): Promise<Request> {
    const reqId = data.reqId;
    const actionPersonId = actorId;
    try {
      const request = await this.requestModel.findById(reqId);
      const { itemId, requestPersonId } = request;

      const item = await this.itemService.findById(itemId);
      const { ownerId } = item;

      if (request.status === requestStatus.rejected)
        throw new Error('this item already rejected');

      if (ownerId === undefined) throw new Error('no this request id');
      if (ownerId.toHexString().toString() !== actionPersonId.toString()) {
        throw new Error('actor person is not item owner');
      }

      const giver = await this.userService.findById(actionPersonId);
      const receiver = await this.userService.findById(requestPersonId);
      await this.itemLogService.addLog({
        itemId: itemId,
        actorId: actionPersonId,
        action: `${giver.info.firstName} ได้ปฏิเสธที่จะส่งต่อของให้ ${receiver.info.firstName}`,
      });
      request.status = requestStatus.rejected;
      await request.save();
      await this.chatService.sendMessage({
        chatRoomId: request.chat_uid.toHexString().toString(),
        messagePayload: {
          from: giver.id,
          to: receiver.id,
          message: `นี่เป็นข้อความอัตฺโนมัติ : ${giver.info.firstName} ได้ปปฏิเสธที่จะส่งต่อ ${item.name} ให้คุณ\nห้องแชทได้ถูกปิด คุณไม่สามารถส่งข้อความหากันได้อีกต่อไป`,
          timestamp: new Date(),
        },
      });
      await this.chatService.disableChat({ chatUid: request.chat_uid });

      await this.pubSub.publish('requestUpdated', {
        requestUpdated: { request, notifyTo: receiver.id },
      });
      return request;
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  async validateChatWithUserId(
    chatId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const request = await this.requestModel.findOne({
        chat_uid: Types.ObjectId(chatId),
        $or: [
          { requestPersonId: Types.ObjectId(userId) },
          { requestToPersonId: Types.ObjectId(userId) },
        ],
      });

      if (request) {
        return true;
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  newRequest(): AsyncIterator<Request> {
    return this.pubSub.asyncIterator<Request>('newRequest');
  }
  requestUpdated(): AsyncIterator<RequestUpdatedNotify> {
    return this.pubSub.asyncIterator<RequestUpdatedNotify>('requestUpdated');
  }
}
