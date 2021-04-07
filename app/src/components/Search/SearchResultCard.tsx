/* eslint-disable react-native/no-inline-styles */
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {RootStackParamList} from '../../navigation-types';
import {RootState} from '../../store';
import {Item} from '../../store/item/types';

import {CustomText, ProgressiveImage} from '../custom-components';

type Props = {
  item: Item;
};

const SearchResultCard: React.FC<Props> = ({item}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mySavedItem = useSelector((state: RootState) => state.user.mySavedItem);
  return (
    <View style={{flexDirection: 'row', marginVertical: 10}}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Detail', {
            item,
            wishlist: mySavedItem.some(({id}) => id === item.id),
          })
        }>
        <ProgressiveImage
          source={{uri: item.images[0]}}
          loadingType="loadingMotion"
          style={{width: 100, height: 100, borderRadius: 5}}
        />
      </TouchableOpacity>
      <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
        <CustomText fontSize={22} fontWeight="bold">
          {item.name}
        </CustomText>
        <CustomText fontSize={16}>ประเภท : {item.category}</CustomText>

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <CustomText fontSize={16}>แท็ก : </CustomText>
          {item.tags.map((tag, i) => (
            <CustomText key={i.toString()} fontSize={16}>
              {tag} {i !== item.tags.length - 1 && ','}
            </CustomText>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SearchResultCard;
