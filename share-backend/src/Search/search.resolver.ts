import { Args, Query, Resolver } from '@nestjs/graphql';
import { Item } from '../Item/dto/item.model';
import { SearchService } from './search.service';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [Item])
  async searchItem(@Args('searchKey') searchKey: string): Promise<Item[]> {
    return this.searchService.searchByKeyword(searchKey);
  }
}
