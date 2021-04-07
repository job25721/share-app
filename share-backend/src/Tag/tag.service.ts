import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TagDocument } from './tag.schema';
import { Model, Types } from 'mongoose';
import { Tag } from './dto/tag.model';

@Injectable()
export class TagService {
  constructor(@InjectModel('Tag') private tagModel: Model<TagDocument>) {}

  async initTagCollection(tagInput: {
    tagName: string;
    addedPerson: Types.ObjectId;
  }): Promise<Tag> {
    const { tagName, addedPerson } = tagInput;
    try {
      const newTagCollection = new this.tagModel({
        name: tagName,
        addedBy: addedPerson,
        usedFreq: 1,
      });
      return await newTagCollection.save();
    } catch (err) {
      return err;
    }
  }

  async addTagFreq(tagInput: {
    tagName: string;
    addedPerson: Types.ObjectId;
  }): Promise<void> {
    const { tagName, addedPerson } = tagInput;
    try {
      const existTag = await this.tagModel.findOne({ name: tagName });
      if (existTag !== null) {
        existTag.usedFreq += 1;
        await existTag.save();
      } else {
        await this.initTagCollection({ tagName, addedPerson });
      }
    } catch (err) {
      return err;
    }
  }

  async getMostUsedTag() {
    return this.tagModel.find().sort({ usedFreq: -1 }).limit(10);
  }
}
