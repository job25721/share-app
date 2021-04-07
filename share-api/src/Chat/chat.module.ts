import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemModule } from 'src/Item/item.module';
import { RequestModule } from 'src/Request/request.module';
import { ChatGateway } from './chat.gateway';
import { ChatResolver } from './chat.resolver';
import { ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    ItemModule,
    forwardRef(() => RequestModule),
  ],
  providers: [ChatService, ChatGateway, ChatResolver],
  exports: [ChatService],
})
export class ChatModule {}
