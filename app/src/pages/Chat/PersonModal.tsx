import React from 'react';
import {View, ScrollView, SafeAreaView, StyleSheet} from 'react-native';
import {ItemChatCard} from '../../components/Chat/ChatCard';
import {Colors, PantoneColor} from '../../utils/Colors';
import {CustomText, Button} from '../../components/custom-components';

import Feather from 'react-native-vector-icons/Feather';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ChatStackParamList} from '../../navigation-types';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

type PersonScreenRouteProp = RouteProp<ChatStackParamList, 'Person'>;
type PersonScreenNavigationProp = StackNavigationProp<
  ChatStackParamList,
  'Person'
>;

type Props = {
  route: PersonScreenRouteProp;
  navigation: PersonScreenNavigationProp;
};

const PersonModal: React.FC<Props> = ({navigation, route}) => {
  const {itemId, itemName} = route.params;
  const myReceiveRequests = useSelector(
    (state: RootState) => state.request.myReceiveRequests,
  );
  const currentUser = useSelector((state: RootState) => state.user.userData);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={25} />
          </Button>
          <View>
            <CustomText fontWeight="bold" color={PantoneColor.livingCoral}>
              คนที่กำลังขอรับ
            </CustomText>
            <CustomText>
              <CustomText fontWeight="bold">{itemName}</CustomText>
              <CustomText> ของคุณ</CustomText>
            </CustomText>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {myReceiveRequests
            .slice(0)
            .find(({item}) => item.id === itemId)
            ?.request.map((request) => (
              <ItemChatCard
                loading={false}
                key={request.id}
                type="Person"
                request={request}
                latestMsg={{
                  from:
                    request.chat.data.length > 0
                      ? request.chat.data[request.chat.data.length - 1].from
                      : '',
                  msg:
                    request.chat.data.length > 0
                      ? request.chat.data[request.chat.data.length - 1].message
                      : '',
                }}
                notification={
                  request.chat.data.filter(
                    ({hasReaded, to}) =>
                      hasReaded === false && currentUser?.id === to,
                  ).length
                }
              />
            ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: Colors._gray_300, flex: 1},
  scrollContainer: {
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
});

export default PersonModal;
