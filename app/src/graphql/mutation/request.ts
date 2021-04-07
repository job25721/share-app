import {gql} from '@apollo/client';
import {Request} from '../../store/request/types';

export interface ReuquestMutationReturnType {
  createRequest: Request;
  acceptRequest: Request;
  acceptDelivered: Request;
  rejectRequest: Request;
}
export interface SendRequestDto {
  itemId: string;
  reason: string;
  wantedRate: number;
}
export const CREATE_REQUEST = gql`
  mutation CreateRequest(
    $reason: String!
    $wantedRate: Float!
    $itemId: String!
  ) {
    createRequest(
      reqData: {reason: $reason, wantedRate: $wantedRate, itemId: $itemId}
    ) {
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
      }
      chat {
        id
        data {
          from
          to
          message
          timestamp
        }
        active
      }
    }
  }
`;

export const ACCEPT_REQUEST = gql`
  mutation AcceptRequest($reqId: String!) {
    acceptRequest(reqData: {reqId: $reqId}) {
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
      }
      chat {
        id
        data {
          from
          to
          message
          timestamp
        }
        active
      }
    }
  }
`;

export const ACCEPT_DELIVERED = gql`
  mutation AcceptDelivered($reqId: String!) {
    acceptDelivered(reqData: {reqId: $reqId}) {
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
      }
      chat {
        id
        data {
          from
          to
          message
          timestamp
        }
        active
      }
    }
  }
`;

export const REJECT_REQUEST = gql`
  mutation RejectRequest($reqId: String!) {
    rejectRequest(reqData: {reqId: $reqId}) {
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
      }
      chat {
        id
        data {
          from
          to
          message
          timestamp
        }
        active
      }
    }
  }
`;
