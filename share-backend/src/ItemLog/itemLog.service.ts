import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from '../User/user.service';
import { ItemLog } from './dto/itemLog.model';
import { ItemLogDocument } from './itemLog.schema';
import { createItemLog } from './logFunction';

@Injectable()
export class ItemLogService {
  constructor(
    @InjectModel('ItemLog') private itemLogModel: Model<ItemLogDocument>,
    private readonly userService: UserService,
  ) {}

  async InitLog(data: { itemId: string; actorId: string }): Promise<ItemLog> {
    const { itemId, actorId } = data;
    const actor = await this.userService.findById(actorId);
    const newItemLogDto: ItemLog = {
      itemId: Types.ObjectId(itemId),
      logs: [
        createItemLog(
          Types.ObjectId(actorId),
          `${actor.info.firstName} ได้เพิ่มของไปที่ SHARE`,
        ),
      ],
    };
    const itemLog = new this.itemLogModel(newItemLogDto);
    return await itemLog.save();
  }

  async addLog(data: {
    itemId: Types.ObjectId;
    actorId: Types.ObjectId;
    action: string;
  }): Promise<ItemLog> {
    const { itemId, actorId, action } = data;
    try {
      const existLog = await this.itemLogModel.findOne({
        itemId,
      });

      if (existLog === null) {
        throw new Error('no such item');
      }

      const newLog = createItemLog(actorId, action);
      newLog.prevHash = existLog.logs[existLog.logs.length - 1].hash;
      existLog.logs.push(newLog);
      return await existLog.save();
    } catch (err) {
      throw err;
    }
  }

  async findById(logId: Types.ObjectId | string): Promise<ItemLog> {
    return this.itemLogModel.findById(logId);
  }

  async findByItemId(itemId: string): Promise<ItemLog> {
    return this.itemLogModel.findOne({ itemId });
  }
}
