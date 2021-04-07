/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';

import Tag from './Tag';
import {Button, CustomText, ProgressiveImage} from '../custom-components';

import FeatherIcon from 'react-native-vector-icons/Feather';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Item} from '../../store/item/types';
import {useNavigation} from '@react-navigation/native';
import {getChatDate, getTime} from '../../utils/getTime';
import {useMutation} from '@apollo/client';
import {
  ADD_WISHLIST_ITEM,
  REMOVE_WISHLIST_ITEM,
} from '../../graphql/mutation/user';

import {RootState, useDispatch} from '../../store';
import {useSelector} from 'react-redux';
import {SliderBox} from '../react-native-image-slider-box';
import {Colors, PantoneColor} from '../../utils/Colors';
import {RootStackParamList} from '../../navigation-types';
import {StackNavigationProp} from '@react-navigation/stack';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const {Item: PItem} = SkeletonPlaceholder;
interface CardProps {
  item: Item;
  isSaved: boolean;
  onRequestClick?: (item: Item) => void;
  loading: boolean;
}

const HomeCardLoading = () => (
  <View style={[cardStyles.card, {height: 375}]}>
    <SkeletonPlaceholder>
      <PItem padding={20} flexDirection="row">
        <PItem width={45} height={45} borderRadius={50} />
        <PItem paddingHorizontal={10} width="100%">
          <PItem width="60%" height={20} />
          <PItem marginTop={6} width="50%" height={20} />
        </PItem>
      </PItem>
      <PItem borderRadius={20} height={300} width="100%" />
    </SkeletonPlaceholder>
  </View>
);
export const Card: React.FC<CardProps> = ({
  item,
  isSaved,
  onRequestClick,
  loading: itemLoading,
}) => {
  const {navigate} = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData);
  const mySendRequests = useSelector(
    (state: RootState) => state.request.mySendRequests,
  );

  const [AddNewBookmark] = useMutation(ADD_WISHLIST_ITEM);
  const [RemoveBookmark] = useMutation(REMOVE_WISHLIST_ITEM);
  const [saved, setSaved] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [requested, setRequested] = useState<boolean>(false);
  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  useEffect(() => {
    const hasRequested = mySendRequests.some(
      (req) =>
        req.item.id === item.id &&
        (req.status === 'requested' ||
          req.status === 'accepted' ||
          req.status === 'delivered'),
    );
    setRequested(hasRequested);
  }, [item.id, mySendRequests]);

  const addToWishlist = async () => {
    try {
      setLoading(true);
      const res = await AddNewBookmark({
        variables: {
          itemId: item.id,
        },
      });
      if (res.errors) {
        throw res.errors;
      }
      dispatch({type: 'ADD_MY_SAVED_ITEM', payload: item});
      setLoading(false);
    } catch (err) {
      dispatch({type: 'REMOVE_SAVED_ITEM', payload: item.id});
    }
  };

  const removeWishlist = async () => {
    try {
      setLoading(true);
      const res = await RemoveBookmark({
        variables: {
          itemId: item.id,
        },
      });
      if (res.errors) {
        throw res.errors;
      }
      dispatch({type: 'REMOVE_SAVED_ITEM', payload: item.id});
      setLoading(false);
    } catch (err) {
      dispatch({type: 'ADD_MY_SAVED_ITEM', payload: item});
    }
  };

  const {name, owner, tags, images, category, createdDate} = item;

  if (itemLoading) {
    return <HomeCardLoading />;
  }

  return (
    <>
      <TouchableOpacity
        style={cardStyles.card}
        onPress={() => navigate('Detail', {item, wishlist: saved})}>
        <View style={cardStyles.userInfo}>
          <TouchableOpacity
            onPress={() =>
              navigate('Profile', {
                userInfo: owner,
                visitor: user && owner.id === user.id ? false : true,
              })
            }>
            <ProgressiveImage
              loadingType="spinner"
              style={cardStyles.userImg}
              source={{uri: owner.avatar}}
            />
          </TouchableOpacity>

          <View style={{paddingHorizontal: 15}}>
            <CustomText fontSize={17} fontWeight="500">
              {owner.info.firstName} {owner.info.lastName}
            </CustomText>
            <CustomText fontSize={13}>
              {getChatDate(new Date(createdDate))}{' '}
              {getTime(new Date(createdDate).getTime())}
            </CustomText>
          </View>
          {user && (
            <View style={cardStyles.btnOptionsView}>
              {user?.id !== item.owner.id && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    flex: 1,
                  }}>
                  {(!saved && !loading && (
                    <Button px={0} onPress={addToWishlist}>
                      <FeatherIcon name="bookmark" size={30} />
                    </Button>
                  )) ||
                    (!loading && (
                      <Button px={0} onPress={removeWishlist}>
                        <MaterialCommunityIcons name="bookmark" size={31} />
                      </Button>
                    ))}
                  {loading ? (
                    <Image
                      style={{width: 60, height: 60}}
                      source={require('../../assets/img/loadingIndicator/ball.gif')}
                    />
                  ) : null}
                </View>
              )}
            </View>
          )}
        </View>
        <SliderBox
          dotColor={PantoneColor.livingCoral}
          TouchableHighlight="#fff"
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            padding: 0,
            margin: 0,
            backgroundColor: 'rgba(128, 128, 128, 0.92)',
          }}
          onCurrentImagePressed={() =>
            navigate('Detail', {item, wishlist: saved})
          }
          paginationBoxVerticalPadding={20}
          sliderBoxHeight={300}
          images={images}
        />
        <View style={cardStyles.content}>
          {/* <CustomText>145 Likes</CustomText> */}
          <View>
            <CustomText fontWeight="bold" fontSize={20}>
              {name}
            </CustomText>
          </View>
          <CustomText>ประเภท : {category}</CustomText>
          <View style={cardStyles.tagContainer}>
            {tags.map((tag, i) => (
              <Tag key={i} text={tag} />
            ))}
          </View>
        </View>
        {user && user.id !== item.owner.id && (
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Button
              text={!requested ? 'ส่งคำขอ' : 'ส่งคำขอแล้ว'}
              onPress={
                onRequestClick && !requested
                  ? () => onRequestClick(item)
                  : undefined
              }
              bg={!requested ? PantoneColor.blueDepths : '#e6e6e6'}
              color={Colors.white}
            />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

export const cardStyles = StyleSheet.create({
  card: {
    width: '100%',
    height: 550,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 15,
    marginBottom: '5%',
  },
  img: {
    width: '100%',
  },
  userImg: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  btnOptionsView: {
    flex: 1,
  },
});
