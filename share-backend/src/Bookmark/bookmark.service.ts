import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookmarkDocument } from './bookmark.schema';
import { Bookmark } from './dto/bookmark.model';
import { BookmarkInput } from './dto/bookmark.input';
import { ItemService } from '../Item/item.service';
import { Item } from '../Item/dto/item.model';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel('Bookmark') private bookmarkModel: Model<BookmarkDocument>,
    private readonly itemService: ItemService,
  ) {}

  async init(initData: { userId: Types.ObjectId }): Promise<Bookmark> {
    const newBookmark = new this.bookmarkModel({
      userId: initData.userId,
      items: [],
    });
    return newBookmark.save();
  }

  async addToBookmark(bookmarkInput: BookmarkInput): Promise<Bookmark> {
    const { userId, itemId } = bookmarkInput;
    try {
      const existDoc = await this.bookmarkModel.findOne({ userId });
      if (existDoc === null) {
        const { id } = await this.init({ userId });
        const bookmark = await this.bookmarkModel.findById(id);
        bookmark.items = [...bookmark.items, itemId];
        return bookmark.save();
      } else {
        const hasBookmarked = existDoc.items.some(
          (item) =>
            item.toHexString().toString() === itemId.toHexString().toString(),
        );
        if (hasBookmarked) {
          throw new Error('You has already saved this item');
        }
        existDoc.items = [...existDoc.items, itemId];
      }
      return existDoc.save();
    } catch (err) {
      return err;
    }
  }

  async removeBookmark(bookmarkInput: BookmarkInput): Promise<Bookmark> {
    const { userId, itemId } = bookmarkInput;
    try {
      const existDoc = await this.bookmarkModel.findOne({ userId });
      if (existDoc === null) {
        throw new Error(
          'You never save any item go to save your fav item first',
        );
      }

      existDoc.items = existDoc.items.filter(
        (item) =>
          item.toHexString().toString() !== itemId.toHexString().toString(),
      );
      return existDoc.save();
    } catch (err) {
      return err;
    }
  }

  async findMyBookmark(userId: string): Promise<Item[]> {
    const bookmark = await this.bookmarkModel.findOne({
      userId,
    });
    if (bookmark === null) return [];
    return this.itemService.aggregateItems(bookmark.items);
  }
}
