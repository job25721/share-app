import {Dispatch} from 'react';
import {Item} from './types';
import {MutationFunction} from '@apollo/client';
import {FormActionTypes} from '../../components/Share/types';
import storage from '@react-native-firebase/storage';
import {AddItemMutationReturnType} from '../../graphql/mutation/item';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation-types';
export const addItemAction = (
  newItem: Item,
  addItemMutation: MutationFunction<AddItemMutationReturnType>,
  navigation: StackNavigationProp<RootStackParamList, 'Share'>,
) => async (formDispatch: Dispatch<FormActionTypes>) => {
  const {name, description, category, images, tags, owner} = newItem;
  if (owner) {
    try {
      formDispatch({type: 'SET_SUBMIT_LOADING', payload: true});
      const fireBaseImgURL = [];
      for (let i = 0; i < images.length; i++) {
        const imgPath = images[i];
        const filename = imgPath.substr(
          imgPath.lastIndexOf('/') + 1,
          imgPath.length,
        );
        const imgRef = storage().ref(
          `${owner.info.firstName}/images/items/${name}/${filename}`,
        );
        await imgRef.putFile(imgPath);
        const imgURL = await imgRef.getDownloadURL();
        fireBaseImgURL.push(imgURL);
        formDispatch({type: 'SET_UPLOAD_STATE', payload: i + 1});
      }
      const {data, errors} = await addItemMutation({
        variables: {
          name,
          tags,
          category,
          description,
          images: fireBaseImgURL,
        },
      });
      if (errors) {
        throw errors;
      }
      if (data?.addNewItem) {
        navigation.navigate('Tab', {screen: 'Home'});
      }
    } catch (err) {
      // console.log(err);
    }
  }
};
