import {
  LazyQueryResult,
  OperationVariables,
  useLazyQuery,
} from '@apollo/client';
import {useCallback, useEffect, useState} from 'react';
import {
  GetRequestsQueryType,
  GET_MY_REQUESTS,
} from '../../graphql/query/request';
import {useDispatch} from '../../store';

export const useMyReceivingRequestsQuery = (): [
  LazyQueryResult<GetRequestsQueryType, OperationVariables>,
  () => Promise<void>,
  boolean,
] => {
  const dispatch = useDispatch();
  const [load, query] = useLazyQuery<GetRequestsQueryType>(GET_MY_REQUESTS);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (query.data?.getMyRequests) {
      const {getMyRequests} = query.data;
      console.log('query requests');
      const setData = getMyRequests.slice(0).sort((a, b) => {
        return b.chat.lastestUpdate - a.chat.lastestUpdate;
      });
      dispatch({
        type: 'SET_MY_RECEIVE_REQUETS',
        payload: setData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  const refetch = useCallback(async () => {
    if (query.refetch) {
      setRefreshing(true);
      try {
        await query.refetch();
        setRefreshing(false);
      } catch (err) {
        // console.log(err);
      }
    }
  }, [query]);

  return [query, refetch, refreshing];
};
