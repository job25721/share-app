import {gql, DocumentNode} from '@apollo/client';
import {Request} from '../../store/request/types';
export interface GetRequestsQueryType {
  getMySendRequests?: Request[];
  getMyRequests?: Request[];
}
export const GET_MY_RECEIVING_ITEM: DocumentNode = gql`
  query {
    getMySendRequests {
      id
      reason
      wantedRate
      status
      requestPerson {
        id
        avatar
        info {
          firstName
          lastName
        }
      }
      item {
        id
        name
        category
        description
        tags
        status
        images
        owner {
          id
          avatar
          info {
            firstName
            lastName
          }
        }
        acceptedToPerson {
          id
          avatar
          info {
            firstName
            lastName
          }
        }
      }
      chat_uid
      chat {
        id
        data {
          from
          to
          message
          timestamp
          hasReaded
        }
        active
        lastestUpdate
      }
    }
  }
`;

export const GET_MY_REQUESTS = gql`
  query {
    getMyRequests {
      id
      requestPerson {
        id
        avatar
        info {
          firstName
          lastName
        }
      }
      reason
      wantedRate
      status
      item {
        id
        name
        category
        description
        tags
        status
        images
        owner {
          id
          avatar
          info {
            firstName
            lastName
          }
        }
        acceptedToPerson {
          id
          avatar
          info {
            firstName
            lastName
          }
        }
      }
      chat {
        id
        data {
          from
          to
          message
          timestamp
          hasReaded
        }
        active
        lastestUpdate
      }
    }
  }
`;
