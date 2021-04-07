import { Injectable } from '@nestjs/common';
import { ItemService } from '../Item/item.service';

@Injectable()
export class SearchService {
  constructor(private readonly itemService: ItemService) {}

  searchByKeyword(searchKey: string) {
    return this.itemService.searchItem(searchKey);
  }
}
