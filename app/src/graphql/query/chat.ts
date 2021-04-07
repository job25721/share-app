import {gql} from '@apollo/client';

export const GET_CHAT_BY_ID = gql`
  query GetChatById($chatRoomId: String!) {
    getChatById(chatRoomId: $chatRoomId) {
      id
      data {
        message
        from
        to
        timestamp
        hasReaded
      }
      active
    }
  }
`;
