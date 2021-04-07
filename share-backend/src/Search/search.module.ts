import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ItemModule } from '../Item/item.module';
import { SearchResolver } from './search.resolver';

@Module({
  imports: [ItemModule],
  providers: [SearchService, SearchResolver],
})
export class SearchModule {}
