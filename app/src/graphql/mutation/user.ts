import {gql} from '@apollo/client';

export const USER_LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(auth: {username: $username, password: $password})
  }
`;

export const FACEBOOK_LOGIN = gql`
  mutation FacebookSign($fbAccessToken: String!) {
    facebookSign(fbAccessToken: $fbAccessToken)
  }
`;

export const ADD_WISHLIST_ITEM = gql`
  mutation AddNewBookmark($itemId: String!) {
    addNewBookmark(itemId: $itemId) {
      items
    }
  }
`;

export const REMOVE_WISHLIST_ITEM = gql`
  mutation RemoveBookmark($itemId: String!) {
    removeBookmark(itemId: $itemId) {
      items
    }
  }
`;
