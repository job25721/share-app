import gql from 'graphql-tag';
import {Item} from '../../store/item/types';
import {User} from '../../store/user/types';

export interface MyInfoQueryType {
  getMyInfo: User;
}
export const GET_MY_INFO = gql`
  query {
    getMyInfo {
      id
      avatar
      email
      info {
        firstName
        lastName
      }
      facebookId
    }
  }
`;

export interface MyItemQueryType {
  getMyItem: Item[];
  getMyReceivedItem: Item[];
}
export const GET_MY_ITEM = gql`
  query {
    getMyItem {
      id
      name
      category
      description
      images
      tags
      owner {
        id
        avatar
        info {
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_MY_RECEIVED_ITEM = gql`
  query {
    getMyReceivedItem {
      id
      name
      category
      images
      description
      tags
      owner {
        avatar
        info {
          firstName
          lastName
        }
      }
    }
  }
`;

export interface MySavedQuery {
  getMyBookmarks: Item[];
}
export const GET_MY_SAVED_ITEM = gql`
  query {
    getMyBookmarks {
      id
      name
      category
      description
      images
      tags
      owner {
        avatar
        info {
          firstName
          lastName
        }
      }
    }
  }
`;

export interface FindUserByIdQuery {
  getUserById: User;
}

export const GET_USER_BY_ID = gql`
  query GetUserById($userID: String!) {
    getUserById(userID: $userID) {
      id
      info {
        firstName
        lastName
      }
    }
  }
`;
