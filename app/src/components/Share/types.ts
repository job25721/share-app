const ADD_IMAGE = 'ADD_IMAGE';
const SET_ITEM_NAME = 'SET_ITEM_NAME';
const SET_PICKER_TYPE = 'SET_PICKER_TYPE';
const SET_DESCRIPTION = 'SET_DESCRIPTION';
const ADD_TAG = 'ADD_TAG';
const REMOVE_TAG = 'REMOVE_TAG';
const REMOVE_IMAGE = 'REMOVE_IMAGE';
const SET_MODAL = 'SET_MODAL';
const CLEAR_FORM = 'CLEAR_FORM';
const SET_IMAGE_PREVIEW = 'SET_IMAGE_PREVIEW';
const SET_SUBMIT_LOADING = 'SET_SUBMIT_LOADING';
const SET_UPLOAD_STATE = 'SET_UPLOAD_STATE';

export type FormActionTypes =
  | {type: typeof ADD_IMAGE; payload: string[]}
  | {type: typeof SET_ITEM_NAME; payload: string}
  | {type: typeof SET_PICKER_TYPE; payload: string | undefined}
  | {type: typeof SET_DESCRIPTION; payload: string}
  | {type: typeof ADD_TAG; payload: FormTag}
  | {type: typeof REMOVE_TAG; payload: number}
  | {type: typeof REMOVE_IMAGE; payload: string}
  | {type: typeof SET_MODAL; payload: boolean}
  | {type: typeof SET_IMAGE_PREVIEW; payload: boolean}
  | {type: typeof SET_SUBMIT_LOADING; payload: boolean}
  | {type: typeof SET_UPLOAD_STATE; payload: number}
  | {type: typeof CLEAR_FORM};

interface PickerItem {
  label: string;
  value: string | number | undefined;
  key: string;
}
export interface FormTag {
  id: number;
  text: string;
}

export interface FormState {
  images: string[];
  itemName: string;
  selectedType: string | undefined;
  description: string;
  tags: FormTag[];
  pickerModalOpen: boolean;
  imagePreviewOpen: boolean;
  onSubmitLoading: boolean;
  uploadedState: number;
  pickerItems: PickerItem[];
}
