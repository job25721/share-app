import {LazyQueryResult, QueryLazyOptions, useLazyQuery} from '@apollo/client';
import {useEffect} from 'react';
import {SearchResult, SEARCH_ITEM_BY_KEYWORD} from '../../graphql/query/item';
import {useDispatch} from '../../store';

export const useSearch = (): {
  searchQuery: LazyQueryResult<SearchResult, {searchKey: string}>;
  search: (options?: QueryLazyOptions<{searchKey: string}> | undefined) => void;
} => {
  const dispatch = useDispatch();

  const [search, searchQuery] = useLazyQuery<SearchResult, {searchKey: string}>(
    SEARCH_ITEM_BY_KEYWORD,
    {fetchPolicy: 'network-only'},
  );

  useEffect(() => {
    if (searchQuery.data) {
      dispatch({
        type: 'SET_SEARCH_RESULT',
        payload: searchQuery.data.searchItem,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery.data]);

  return {search, searchQuery};
};
