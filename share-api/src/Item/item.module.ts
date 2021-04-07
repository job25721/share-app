import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemLogModule } from '../ItemLog/itemLog.module';
import { UserModule } from '../User/user.module';
import { ItemResolver } from './item.resolver';
import { ItemSchema } from './item.schema';
import { ItemService } from './item.service';
import { TagModule } from '../Tag/tag.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    ItemLogModule,
    UserModule,
    TagModule,
  ],
  providers: [ItemResolver, ItemService],
  exports: [ItemService],
})
export class ItemModule {}
