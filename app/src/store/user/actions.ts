import {MutationFunction} from '@apollo/client';
import {Dispatch} from 'react';
import {StoreEvent} from '..';
import {Item} from '../item/types';

export const addWishlistAction = (
  addWishListMutation: MutationFunction,
  item: Item,
) => async (dispatch: Dispatch<StoreEvent>) => {};
