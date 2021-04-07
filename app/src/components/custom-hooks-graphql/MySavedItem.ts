import {QueryResult, useQuery} from '@apollo/client';
import {useCallback, useEffect, useState} from 'react';
import {GET_MY_SAVED_ITEM, MySavedQuery} from '../../graphql/query/user';
import {useDispatch} from '../../store';

export const useMySavedItemQuery = (): [
  QueryResult<MySavedQuery>,
  () => Promise<void>,
  boolean,
] => {
  const query = useQuery<MySavedQuery>(GET_MY_SAVED_ITEM);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (query.data?.getMyBookmarks) {
      // console.log('query saved item');
      dispatch({
        type: 'SET_MY_SAVED_ITEM',
        payload: query.data.getMyBookmarks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

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
