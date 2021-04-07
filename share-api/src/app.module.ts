import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.comtroller';

import { ChatModule } from './Chat/chat.module';
import { ItemModule } from './Item/item.module';
import { ItemLogModule } from './ItemLog/itemLog.module';
import { RequestModule } from './Request/request.module';
import { UserModule } from './User/user.module';
import { BookmarkModule } from './Bookmark/bookmark.module';
import { TagModule } from './Tag/tag.module';
import { SearchModule } from './Search/search.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: true,
      context: async ({ req, connection }) =>
        connection ? connection.context : { headers: req.headers },
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.h3ocx.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`,
      { useCreateIndex: true },
    ),
    ItemModule,
    ItemLogModule,
    UserModule,
    ChatModule,
    RequestModule,
    BookmarkModule,
    TagModule,
    SearchModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
