import {gql} from '@apollo/client';
import {Item} from '../../store/item/types';

export interface AddItemMutationReturnType {
  addNewItem: Item;
}
export const ADD_NEW_ITEM = gql`
  mutation AddNewItem(
    $name: String!
    $category: String!
    $description: String!
    $tags: [String!]
    $images: [String!]!
  ) {
    addNewItem(
      item: {
        name: $name
        category: $category
        description: $description
        tags: $tags
        images: $images
      }
    ) {
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
