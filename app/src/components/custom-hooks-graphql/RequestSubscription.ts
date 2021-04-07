import {useSubscription} from '@apollo/client';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {NEW_REQUEST, REQUEST_UPDATED} from '../../graphql/subcription/request';
import {RootState, useDispatch} from '../../store';
import {Request} from '../../store/request/types';

export interface RequestUpdatedNotify {
  request: Request;
  notifyTo: string;
}

export const useRequestSubscription = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const {mySendRequests} = useSelector((state: RootState) => state.request);
  const newRequest = useSubscription<{newRequest: Request}>(NEW_REQUEST);
  const updated = useSubscription<{requestUpdated: RequestUpdatedNotify}>(
    REQUEST_UPDATED,
  );

  useEffect(() => {
    if (
      newRequest.data &&
      newRequest.data.newRequest.item.owner.id === currentUser?.id
    ) {
      dispatch({
        type: 'ADD_MY_RECEIVE_REQUETS',
        payload: newRequest.data.newRequest,
      });
      dispatch({
        type: 'SORT_REQUEST_ARR_TYPE_PERSON',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRequest.data, currentUser]);

  useEffect(() => {
    if (updated.data) {
      const {request, notifyTo} = updated.data.requestUpdated;
      if (notifyTo === currentUser?.id) {
        const caseSendRequest = mySendRequests.some(
          ({id}) => id === request.id,
        );
        if (caseSendRequest) {
          dispatch({
            type: 'UPDATE_MY_SEND_REQUEST',
            payload: {requestId: request.id, update: request},
          });
        } else {
          dispatch({
            type: 'UPDATE_RECEIVE_REQUEST',
            payload: {
              requestId: request.id,
              itemId: request.item.id,
              update: request,
            },
          });
        }
        dispatch({
          type: 'SET_REQUEST_NOTIFY',
          payload: updated.data.requestUpdated,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated.data]);

  return null;
};
