import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { ItemLog } from '../ItemLog/dto/itemLog.model';

import { ItemLogService } from '../ItemLog/itemLog.service';

import { User } from '../User/dto/user.model';
import { UserService } from '../User/user.service';
import { ItemInput, ChangeStatus } from './dto/item.input';
import { Item } from './dto/item.model';
import { ItemService } from './item.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../User/auth.guard';
import { PubSub } from 'apollo-server-express';

@Resolver(() => Item)
export class ItemResolver {
  private pubSub: PubSub;

  constructor(
    private readonly itemService: ItemService,
    private readonly userService: UserService,
    private readonly itemLogService: ItemLogService,
  ) {
    this.pubSub = new PubSub();
  }

  @Query(() => [Item])
  async getAllItem(): Promise<Item[]> {
    return await this.itemService.findAll();
  }

  @Query(() => [Item])
  async getFeedItems(): Promise<Item[]> {
    return this.itemService.getFeedItems();
  }

  @Query(() => Item)
  async getItemById(@Args('itemId') id: string): Promise<Item> {
    return await this.itemService.findById(id);
  }

  @UseGuards(new AuthGuard())
  @Query(() => [Item])
  async getMyItem(@Context('user') user): Promise<Item[]> {
    return await this.itemService.findMyAllItem(user.id);
  }

  @UseGuards(new AuthGuard())
  @Query(() => [Item])
  async getMyReceivedItem(@Context('user') user): Promise<Item[]> {
    return this.itemService.findMyAllReceivedItem(user.id);
  }

  @UseGuards(new AuthGuard())
  @Mutation(() => Item)
  async updateItemStatus(@Args('data') data: ChangeStatus): Promise<Item> {
    return await this.itemService.changeItemStatus(data);
  }

  @UseGuards(new AuthGuard())
  @Mutation(() => Item)
  async addNewItem(
    @Args('item') newItem: ItemInput,
    @Context('user') user,
  ): Promise<Item> {
    const createdItem = await this.itemService.create(newItem, user.id);
    this.pubSub.publish('itemAdded', { itemAdded: createdItem });
    return createdItem;
  }

  @Subscription(() => Item)
  itemAdded() {
    return this.pubSub.asyncIterator('itemAdded');
  }

  @ResolveField(() => User)
  async owner(@Parent() { ownerId }: Item): Promise<User> {
    return await this.userService.findById(ownerId);
  }

  @ResolveField(() => ItemLog)
  async log(@Parent() { logId }: Item): Promise<ItemLog> {
    return await this.itemLogService.findById(logId);
  }

  @ResolveField(() => User, { nullable: true })
  async acceptedToPerson(@Parent() { acceptedTo }: Item): Promise<User | null> {
    return await this.userService.findById(acceptedTo);
  }
}
