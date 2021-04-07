import {gql} from '@apollo/client';
export interface NewDirectMessage {
  chatRoomId: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  requestId: string;
  itemId: string;
  hasReaded: boolean;
}
export const CHAT_SUBSCRIPTION = gql`
  subscription {
    newDirectMessage {
      chatRoomId
      message
      from
      to
      timestamp
      requestId
      itemId
      hasReaded
    }
  }
`;
