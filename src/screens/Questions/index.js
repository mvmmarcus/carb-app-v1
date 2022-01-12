import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Animated,
  ScrollView,
  View,
  Text,
  Dimensions,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import IconNavigateNext from '../../../assets/navigate_next.svg';
import IconNavigatePrevious from '../../../assets/navigate_before.svg';
import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';

import { theme } from '../../styles/theme';
import { getStyle } from './styles';

const QuestionsScreen = ({ navigation }) => {
  const { $primary, $secondary, $white, $xxxlarge } = theme;
  const { width } = Dimensions.get('screen');
  const SEPARATOR_WIDTH = 24;

  const styles = getStyle({ width, SEPARATOR_WIDTH });

  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length) setIndex(viewableItems[0]?.index);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 100 });

  const data = [
    {
      id: 1,
      title: 'Qual é seu tipo de diabetes?',
      options: [
        {
          label: 'Tipo 1',
          id: 'type_1',
        },
        {
          label: 'Tipo 2',
          id: 'type_2',
        },
        {
          label: 'Outro',
          id: 'other',
        },
      ],
    },
    {
      id: 2,
      title: 'Qual é a sua faixa alvo?',
      customContent: (
        <View>
          <Text>cutom</Text>
        </View>
      ),
      options: [],
    },
    {
      id: 3,
      title: 'Qual a sua terapia para diabetes?',
      options: [
        {
          label: 'Caneta / Seringa',
          id: 'pen_syringe',
        },
        {
          label: 'Bomba',
          id: 'bomb',
        },
      ],
    },
    {
      id: 4,
      title: 'Qual a sua terapia para diabetes testeee?',
      options: [
        {
          label: 'Caneta / Seringa',
          id: 'pen_syringe',
        },
        {
          label: 'Bomba',
          id: 'bomb',
        },
      ],
    },
  ];

  const handleSlide = ({ type }) => {
    if (type === 'next') {
      flatListRef?.current?.scrollToIndex({
        animating: true,
        index: index < data?.length - 1 ? index + 1 : index,
      });

      return;
    }

    flatListRef?.current?.scrollToIndex({
      animating: true,
      index: index > 0 ? index - 1 : index,
    });
  };

  const Separator = () => <View style={{ width: SEPARATOR_WIDTH }}></View>;

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.slider}>
            <View style={styles.sliderHeader}>
              <CustomText weight="regular" style={{ color: $white }}>
                Pergunta
              </CustomText>
              <CustomText weight="regular" style={{ color: $white }}>
                {index + 1}
              </CustomText>
            </View>
            <View style={styles.sliderContent}>
              <Animated.FlatList
                data={data}
                ref={flatListRef}
                onViewableItemsChanged={onViewRef?.current}
                viewabilityConfig={viewConfigRef?.current}
                keyExtractor={(item) => item?.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                ItemSeparatorComponent={Separator}
                scrollEnabled={false}
                style={{
                  paddingStart: SEPARATOR_WIDTH * 2,
                }}
                contentContainerStyle={{
                  paddingEnd: SEPARATOR_WIDTH * 4,
                }}
                renderItem={({ item }) => (
                  <View style={styles.sliderItem}>
                    <View style={styles.question}>
                      <Text>{item?.title}</Text>
                    </View>
                    <View style={styles.buttonGroup}>
                      {index > 0 && (
                        <CustomButtom
                          width={$xxxlarge}
                          icon={() => <IconNavigatePrevious />}
                          backgroundColor={$secondary}
                          color={$white}
                          onPress={() => handleSlide({ type: 'previous' })}
                        />
                      )}
                      {data?.length && index < data?.length - 1 && (
                        <CustomButtom
                          width={$xxxlarge}
                          icon={() => <IconNavigateNext />}
                          backgroundColor={$secondary}
                          color={$white}
                          onPress={() => handleSlide({ type: 'next' })}
                        />
                      )}
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default QuestionsScreen;
