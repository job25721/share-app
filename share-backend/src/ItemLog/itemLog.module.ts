import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../User/user.module';
import { ItemLogSchema } from './itemLog.schema';
import { ItemLogService } from './itemLog.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ItemLog', schema: ItemLogSchema }]),
    UserModule,
  ],
  providers: [ItemLogService],
  exports: [ItemLogService],
})
export class ItemLogModule {}
