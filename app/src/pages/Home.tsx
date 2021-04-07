/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  ScrollView,
  View,
  SafeAreaView,
  RefreshControl,
  Image,
} from 'react-native';
import {Colors, PantoneColor} from '../utils/Colors';
import {Button, CustomText} from '../components/custom-components';
import {RootState} from '../store';
import {RouteProp, useFocusEffect} from '@react-navigation/native';

import {RootStackParamList} from '../navigation-types';
import {StackNavigationProp} from '@react-navigation/stack';
import {categories} from '../utils/category';
import {Card, HomeHeader, IconList} from '../components/Home';
import {useQuery} from '@apollo/client';
import {GetAllItemQueryType, GET_ALL_ITEM} from '../graphql/query/item';
import {Item} from '../store/item/types';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Tab'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

const FetchingSkeletion = () => (
  <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item padding={20} flexDirection="row">
      <SkeletonPlaceholder.Item width={45} height={45} borderRadius={50} />
      <SkeletonPlaceholder.Item paddingHorizontal={10} width="100%">
        <SkeletonPlaceholder.Item width="60%" height={20} />
        <SkeletonPlaceholder.Item marginTop={6} width="50%" height={20} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder.Item>
    <SkeletonPlaceholder.Item borderRadius={20} height={300} width="100%" />
  </SkeletonPlaceholder>
);

const Home: React.FC<Props> = ({navigation}) => {
  const savedItems = useSelector((state: RootState) => state.user.mySavedItem);
  const [reload, setReload] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);
  const [feedItems, setFeedItem] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);

  const {data, refetch, error, loading} = useQuery<GetAllItemQueryType>(
    GET_ALL_ITEM,
  );

  const refreshItem = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const refetchItem = await refetch();
      if (refetchItem.error) {
        throw refetchItem.error;
      }
      if (refetchItem.data) {
        setFeedItem(refetchItem.data.getFeedItems);
        setFetching(false);
      }
      setRefreshing(false);
    } catch (err) {
      console.log(err);
    }
  }, [refetch]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFeedItem = async () => {
        if (refetch) {
          try {
            const {data: refetchData, error: refetchError} = await refetch();
            if (refetchError) {
              throw refetchError;
            }
            if (refetchData) {
              setFeedItem(refetchData.getFeedItems);
              setFetching(false);
            }
          } catch (err) {
            console.log(err);
          }
        } else if (data) {
          setFeedItem(data.getFeedItems);
          setFetching(false);
        }
      };

      fetchFeedItem();

      return () => {
        setFeedItem([]);
      };
    }, [data, refetch]),
  );

  async function reloadData() {
    try {
      setReload(true);
      await refreshItem();
    } catch (err) {
      setReload(false);
      // console.log(err);
    }

    // setTimeout(() => {
    //   setReload(false);
    // }, 10000);
  }

  if (error) {
    return (
      <SafeAreaView
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        {!reload ? (
          <>
            <CustomText>{error.message}</CustomText>
            <Button
              text="reload"
              color={Colors.white}
              bg={PantoneColor.blueDepths}
              onPress={reloadData}
            />
          </>
        ) : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors._gray_300}}>
      <HomeHeader />
      <View
        style={{paddingLeft: 10, flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={require('../assets/img/logo.png')}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            borderRadius: 50,
          }}
        />
        <CustomText color={PantoneColor.livingCoral} spacing={10} fontSize={40}>
          SHARE
        </CustomText>
      </View>
      <ScrollView
        ref={scrollRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshItem} />
        }
        style={{marginHorizontal: 10, borderRadius: 15}}>
        <View style={{marginBottom: 10}}>
          <CustomText fontSize={20} fontWeight={'bold'}>
            เลือกหมวดหมู่ที่ใช่สำหรับคุณ
          </CustomText>
        </View>

        <ScrollView horizontal>
          {categories.map((item) => (
            <IconList
              key={item.nameIcon}
              text={item.text}
              nameIcon={item.nameIcon}
              onPress={() => {
                navigation.navigate('Tab', {
                  screen: 'Search',
                  params: {
                    catSearch: item.text,
                  },
                });
              }}
            />
          ))}
        </ScrollView>

        <View
          style={{
            alignItems: 'center',
            marginTop: 10,
            paddingHorizontal: 1,
          }}>
          {fetching ? (
            <FetchingSkeletion />
          ) : !loading && data && data.getFeedItems.length > 0 ? (
            feedItems.map((item) => (
              <Card
                loading={loading || refreshing}
                onRequestClick={(selectedIetm) =>
                  navigation.navigate('RequestItem', {item: selectedIetm})
                }
                key={item.id}
                isSaved={savedItems.some(({id}) => id === item.id)}
                item={item}
              />
            ))
          ) : !loading && data && data.getFeedItems.length === 0 ? (
            <>
              <CustomText fontWeight="bold">
                ไม่มีของชิ้นใดอยู่ในระบบ
              </CustomText>
              <CustomText fontWeight="500" fontSize={16}>
                มาร่วม SHARE และสร้างสังคมที่น่าอยู่กันเถอะ!
              </CustomText>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
