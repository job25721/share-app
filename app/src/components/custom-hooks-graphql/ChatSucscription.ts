import {useSubscription} from '@apollo/client';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  CHAT_SUBSCRIPTION,
  NewDirectMessage,
} from '../../graphql/subcription/chat';
import {RootState, useDispatch} from '../../store';
import {SubscribeMessageAction} from '../../store/chat/actions';

export const useChatSubscription = () => {
  const dispatch = useDispatch();
  const newDirect = useSubscription<{newDirectMessage: NewDirectMessage}>(
    CHAT_SUBSCRIPTION,
  );

  const currentUser = useSelector((state: RootState) => state.user.userData);
  const {newDirectMessage} = useSelector((state: RootState) => state.chat);

  const {mySendRequests} = useSelector((state: RootState) => state.request);

  useEffect(() => {
    if (
      newDirect.data &&
      currentUser?.id === newDirect.data.newDirectMessage.to
    ) {
      // console.log('newMessage');
      // console.log(newDirect.data);
      dispatch({
        type: 'SET_NEW_DIRECT',
        payload: newDirect.data.newDirectMessage,
      });
      dispatch({type: 'ADD_CHAT_NOTIFICATION'});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDirect.data, currentUser]);

  useEffect(() => {
    if (newDirectMessage) {
      const caseItemCard = mySendRequests.some(
        ({id}) => id === newDirectMessage.requestId,
      );
      // const casePersonCard = myReceiveRequestPreloaded.some(
      //   ({id}) => id === newDirectMessage.requestId,
      // );
      const itemId = caseItemCard ? undefined : newDirectMessage.itemId;
      SubscribeMessageAction(
        newDirectMessage,
        {
          requestId: newDirectMessage.requestId,
          itemId,
        },
        currentUser ? currentUser.id : '',
      )(dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDirectMessage]);

  return null;
};
