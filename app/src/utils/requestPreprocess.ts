import {Request, SendingItem} from '../store/request/types';

export function preprocessAddNewRequestAbstract(
  oldState: SendingItem[],
  newRequest: Request,
): SendingItem[] {
  const isItemExist: boolean = oldState.some(
    (s) => s.item.id === newRequest.item.id,
  );
  if (isItemExist) {
    return oldState.map<SendingItem>((s) => {
      if (s.item.id === newRequest.item.id) {
        return {
          ...s,
          request: [newRequest, ...s.request],
        };
      }
      return s;
    });
  }

  return [{item: newRequest.item, request: [newRequest]}, ...oldState];
}

export function preprocessData(myReceiveRequests: Request[]) {
  let mySendingItem: SendingItem[] = [];
  for (let i = 0; i < myReceiveRequests.length; i++) {
    const current = myReceiveRequests[i];
    const exist: boolean = mySendingItem.some(
      (s) => s.item.id === current.item.id,
    );
    if (!exist) {
      const pushData: SendingItem = {item: current.item, request: [current]};
      mySendingItem.push(pushData);
    } else {
      const newState: SendingItem[] = mySendingItem.map<SendingItem>((s) => {
        if (s.item.id === current.item.id) {
          return {item: s.item, request: [...s.request, current]};
        }

        return s;
      });
      mySendingItem = newState;
    }
  }

  return mySendingItem;
}
