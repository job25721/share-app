import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './tag.schema';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }])],
  providers: [TagService, TagResolver],
  exports: [TagService],
})
export class TagModule {}
