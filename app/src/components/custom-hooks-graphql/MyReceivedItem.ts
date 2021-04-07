import {QueryResult, useQuery} from '@apollo/client';
import {useCallback, useState} from 'react';
import {GET_MY_RECEIVED_ITEM, MyItemQueryType} from '../../graphql/query/user';

export const useMyReceivedItemQuery = (): [
  QueryResult<MyItemQueryType>,
  () => Promise<void>,
  boolean,
] => {
  const query = useQuery<MyItemQueryType>(GET_MY_RECEIVED_ITEM);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refetch = useCallback(async () => {
    setRefreshing(true);
    try {
      await query.refetch();
      setRefreshing(false);
    } catch (err) {
      // console.log(err);
    }
  }, [query]);

  return [query, refetch, refreshing];
};
