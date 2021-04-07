import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookmarkService } from './bookmark.service';
import { UseGuards } from '@nestjs/common';
import { Bookmark } from './dto/bookmark.model';
import { Item } from '../Item/dto/item.model';
import { AuthGuard } from '../User/auth.guard';

import { Types } from 'mongoose';

@Resolver(() => Bookmark)
export class BookmarkResolver {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(new AuthGuard())
  @Mutation(() => Bookmark)
  async addNewBookmark(
    @Args('itemId') itemId: string,
    @Context('user') user,
  ): Promise<Bookmark> {
    return this.bookmarkService.addToBookmark({
      userId: user.id,
      itemId: Types.ObjectId(itemId),
    });
  }

  @UseGuards(new AuthGuard())
  @Mutation(() => Bookmark)
  async removeBookmark(
    @Args('itemId') itemId: string,
    @Context('user') user,
  ): Promise<Bookmark> {
    return this.bookmarkService.removeBookmark({
      userId: user.id,
      itemId: Types.ObjectId(itemId),
    });
  }

  @UseGuards(new AuthGuard())
  @Query(() => [Item])
  async getMyBookmarks(@Context('user') user): Promise<Item[]> {
    return this.bookmarkService.findMyBookmark(user.id);
  }
}
