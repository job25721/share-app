/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Button, CustomText, ProgressiveImage} from '../custom-components';
import {Colors} from '../../utils/Colors';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation-types';
import {User} from '../../store/user/types';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

interface ProfileImageProps {
  user: User;
  visitor: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({user, visitor}) => {
  const {navigate}: StackNavigationProp<RootStackParamList> = useNavigation();
  const {userData} = useSelector((state: RootState) => state.user);
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
      }}>
      <View
        style={{
          padding: 20,
        }}>
        <ProgressiveImage
          style={{height: 170, width: 130, borderRadius: 10}}
          source={{uri: user.avatar}}
          loadingType="loadingMotion"
        />
        {!visitor && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}>
            <Button
              width={40}
              px={10}
              py={10}
              onPress={() => navigate('Share')}
              rounded
              bg={Colors._indigo_500}>
              <FeatherIcon color={Colors.white} name="edit-2" size={20} />
            </Button>
          </View>
        )}
      </View>
      <View style={{justifyContent: 'center'}}>
        <CustomText>{user.info.firstName}</CustomText>
        <CustomText>{user.info.lastName}</CustomText>
        <CustomText fontSize={16} color="#C7C7C7">
          {visitor ? user.email?.split('@')[0] : userData?.email?.split('@')[0]}
        </CustomText>
        <CustomText fontSize={16} color="#C7C7C7">
          {visitor ? user.email?.split('@')[1] : userData?.email?.split('@')[1]}
        </CustomText>
      </View>
    </View>
  );
};

export default ProfileImage;
