import {DocumentNode} from 'graphql';
import gql from 'graphql-tag';
import {Item} from '../../store/item/types';

export interface GetAllItemQueryType {
  getFeedItems: Item[];
}
export const GET_ALL_ITEM: DocumentNode = gql`
  query {
    getFeedItems {
      id
      name
      owner {
        id
        avatar
        info {
          firstName
          lastName
        }
      }
      tags
      category
      description
      images
      status
      createdDate
    }
  }
`;

export interface SearchResult {
  searchItem: Item[];
}
export const SEARCH_ITEM_BY_KEYWORD = gql`
  query SearchItem($searchKey: String!) {
    searchItem(searchKey: $searchKey) {
      id
      name
      owner {
        id
        avatar
        info {
          firstName
          lastName
        }
      }
      tags
      category
      description
      images
      status
      createdDate
    }
  }
`;
interface TagCollections {
  id: string;
  name: string;
}
export interface TrendingTagQueryResult {
  getMostUsedTag: TagCollections[];
}
export const GET_TREANDING_TAG = gql`
  query {
    getMostUsedTag {
      id
      name
    }
  }
`;
