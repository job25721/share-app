import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItemLogService } from '../ItemLog/itemLog.service';
import { ChangeStatus, ItemInput } from './dto/item.input';
import { Item } from './dto/item.model';
import { ItemDocument } from './item.schema';
import { itemStatus } from '../status';
import { TagService } from '../Tag/tag.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item') private itemModel: Model<ItemDocument>,
    private readonly itemLogService: ItemLogService,
    private readonly tagService: TagService,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().sort({ createdDate: -1 });
  }

  async getFeedItems(): Promise<Item[]> {
    return this.itemModel
      .find({ status: itemStatus.available })
      .sort({ createdDate: -1 });
  }

  async findById(id: Types.ObjectId | string): Promise<Item> {
    try {
      const res = await this.itemModel.findById(id);
      if (res === null) {
        throw new Error("item you're looking not found");
      }
      return res;
    } catch (err) {
      return err;
    }
  }

  async findMyAllItem(ownerId: string): Promise<Item[]> {
    return this.itemModel
      .find({
        ownerId: Types.ObjectId(ownerId),
      })
      .sort({ createdDate: -1 });
  }

  async findMyAllReceivedItem(acceptedToId: string): Promise<Item[]> {
    return this.itemModel
      .find({ acceptedTo: Types.ObjectId(acceptedToId) })
      .sort({ createdDate: -1 });
  }

  async findMyItem(data: { ownerId: string; itemId: string }): Promise<Item> {
    const { ownerId, itemId } = data;
    return this.itemModel.findOne({
      ownerId: Types.ObjectId(ownerId),
      _id: Types.ObjectId(itemId),
    });
  }

  async create(createItemDto: ItemInput, userId: string): Promise<Item> {
    const now = new Date(Date.now());
    const newItem = new this.itemModel(createItemDto);
    newItem.createdDate = now;
    newItem.status = itemStatus.available;
    newItem.ownerId = Types.ObjectId(userId);
    newItem.acceptedTo = null;
    try {
      //addLog
      const itemLog = await this.itemLogService.InitLog({
        itemId: newItem.id,
        actorId: userId,
      });
      newItem.logId = new Types.ObjectId(itemLog.id);
      if (newItem.tags.length > 0) {
        for (const tag of newItem.tags) {
          await this.tagService.addTagFreq({
            tagName: tag,
            addedPerson: newItem.ownerId,
          });
        }
      }
      return newItem.save();
    } catch (err) {
      return err;
    }
  }

  async changeItemStatus(data: ChangeStatus): Promise<Item> {
    const { itemId, status } = data;
    try {
      const res = await this.itemModel.findById(itemId);
      res.status = status;
      return res.save();
    } catch (error) {
      return error;
    }
  }

  async updateAcceptedToPerson(
    itemId: Types.ObjectId,
    reqUser: Types.ObjectId,
  ): Promise<void> {
    try {
      const item = await this.itemModel.findById(itemId);
      if (item) {
        item.acceptedTo = reqUser;
        await item.save();
      } else {
        throw new Error('No such item to update acceptedPerson');
      }
    } catch (error) {
      return error;
    }
  }

  async aggregateItems(itemId: Types.ObjectId[]): Promise<Item[]> {
    try {
      return this.itemModel.find({
        _id: { $in: itemId },
      });
    } catch (err) {
      return err;
    }
  }

  async searchItem(searchKey: string): Promise<Item[]> {
    const regexExpresstion = { $regex: new RegExp(searchKey), $options: 'i' };
    return this.itemModel.find({
      $and: [
        {
          $or: [
            { name: regexExpresstion },
            { description: regexExpresstion },
            { category: regexExpresstion },
            { tags: searchKey },
          ],
        },
        { status: itemStatus.available },
      ],
    });
  }
}
