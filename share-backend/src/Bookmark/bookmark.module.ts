import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookmarkSchema } from './bookmark.schema';
import { BookmarkService } from './bookmark.service';
import { BookmarkResolver } from './bookmark.resolver';
import { ItemModule } from '../Item/item.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bookmark', schema: BookmarkSchema }]),
    ItemModule,
  ],
  providers: [BookmarkService, BookmarkResolver],
})
export class BookmarkModule {}
