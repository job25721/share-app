import {Dispatch} from 'react';
import {categories} from '../../utils/category';
import {FormActionTypes, FormState} from './types';

export const initialState: FormState = {
  images: [],
  itemName: '',
  selectedType: undefined,
  description: '',
  tags: [],
  pickerModalOpen: false,
  imagePreviewOpen: false,
  onSubmitLoading: false,
  uploadedState: 0,
  pickerItems: categories.map((cat) => ({
    label: cat.text,
    value: cat.text,
    key: cat.text,
  })),
};
export type FormReducers = {
  state: FormState;
  dispatch: Dispatch<FormActionTypes>;
};
export function formReducers(
  state: FormState,
  action: FormActionTypes,
): FormState {
  switch (action.type) {
    case 'ADD_IMAGE':
      return {
        ...state,
        images: [...state.images, ...action.payload],
      };
    case 'SET_ITEM_NAME':
      return {
        ...state,
        itemName: action.payload,
      };
    case 'SET_PICKER_TYPE':
      return {
        ...state,
        selectedType: action.payload,
      };
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.payload,
      };
    case 'ADD_TAG':
      return {
        ...state,
        tags: [...state.tags, action.payload],
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== action.payload),
      };
    case 'REMOVE_IMAGE':
      return {
        ...state,
        images: state.images.filter((uri) => uri !== action.payload),
      };
    case 'SET_MODAL':
      return {
        ...state,
        pickerModalOpen: action.payload,
      };
    case 'SET_IMAGE_PREVIEW':
      return {
        ...state,
        imagePreviewOpen: action.payload,
      };

    case 'SET_SUBMIT_LOADING':
      return {
        ...state,
        onSubmitLoading: action.payload,
      };
    case 'SET_UPLOAD_STATE':
      return {
        ...state,
        uploadedState: action.payload,
      };
    case 'CLEAR_FORM':
      return initialState;
    default:
      throw new Error();
  }
}
