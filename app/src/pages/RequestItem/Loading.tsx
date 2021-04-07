/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Image, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useSelector} from 'react-redux';
import {Button, CustomText} from '../../components/custom-components';
import {RootStackParamList} from '../../navigation-types';
import {RootState} from '../../store';
import {Colors, PantoneColor} from '../../utils/Colors';

const RequestLoading = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {onRequestLoading} = useSelector((state: RootState) => state.request);
  return (
    <SafeAreaView
      style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      {!onRequestLoading.complete ? (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            height={150}
            width={150}
            borderRadius={100}
          />
        </SkeletonPlaceholder>
      ) : (
        <Image
          source={require('../../assets/img/logo.png')}
          style={{width: 150, height: 150, borderRadius: 100}}
        />
      )}
      <View style={{margin: 20}}>
        <CustomText textAlign="center">{onRequestLoading.msg}</CustomText>
      </View>
      {onRequestLoading.err && (
        <Button
          bg={PantoneColor.blueDepths}
          color={Colors.white}
          text="ลองใหม่"
          onPress={() => navigation.goBack()}
        />
      )}
    </SafeAreaView>
  );
};

export default RequestLoading;
