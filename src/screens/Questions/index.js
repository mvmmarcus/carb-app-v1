import React, { useRef, useState, useCallback, useContext } from 'react';
import { View, Dimensions, FlatList, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import ScreenWrapper from '#/components/ScreenWrapper';
import UserContext from '../../contexts/user';
import AuthContext from '../../contexts/auth';
import useQuestions from '#/hooks/useQuestions';
import IconNavigateNext from '#/../assets/navigate_next.svg';
import IconCheck from '#/../assets/check.svg';
import IconNavigatePrevious from '#/../assets/navigate_before.svg';
import CustomButtom from '#/components/CustomButton';
import CustomText from '#/components/CustomText';

import { theme } from '#/styles/theme';
import { getStyle } from './styles';

const QuestionsScreen = ({ navigation }) => {
  const { setIsFirstAccess, setInsulinParams } = useContext(UserContext);
  const { user } = useContext(AuthContext);
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({
    type: null,
    targetRange: null,
    therapy: null,
    isChoCount: null,
    choInsulinRelationship: null,
    fixedDoses: null,
    correctionFactor: null,
    meter: null,
  });
  const flatListRef = useRef(null);
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length) setIndex(viewableItems[0]?.index);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 16 });
  const { questions } = useQuestions({
    isChoCount: form.isChoCount === 'yes',
    onChange: ({ questionId, activeValue }) =>
      handleChangeForm({ questionId, activeValue }),
  });
  const { $primary, $secondary, $white, $xxxlarge } = theme;
  const { width, height } = Dimensions.get('screen');
  const SEPARATOR_WIDTH = 24;
  const styles = getStyle({ width, height, SEPARATOR_WIDTH });

  const handleSlide = ({ type }) => {
    if (type === 'next') {
      flatListRef?.current?.scrollToIndex({
        animating: true,
        index: index < questions?.length - 1 ? index + 1 : index,
      });

      return;
    }

    flatListRef?.current?.scrollToIndex({
      animating: true,
      index: index > 0 ? index - 1 : index,
    });
  };

  const handleChangeForm = useCallback(({ questionId, activeValue }) => {
    setForm((prev) => {
      return {
        ...prev,
        [questionId]: activeValue,
      };
    });
  }, []);

  const onFinishQuestions = async (insulinParams, user) => {
    await AsyncStorage.setItem(
      `@carbs:${user?.uid}`,
      JSON.stringify({
        isFirstAccess: false,
        insulinParams: insulinParams,
      })
    );

    console.log({ insulinParams });

    setIsFirstAccess(false);
    setInsulinParams(insulinParams);
  };

  const Separator = () => <View style={{ width: SEPARATOR_WIDTH }}></View>;

  const ResponseSeparator = () => <View style={{ height: 16 }}></View>;

  return (
    <ScreenWrapper>
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
          <FlatList
            data={questions}
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
                  <CustomText weight="medium" style={styles.questionText}>
                    {item?.question}
                  </CustomText>
                  {item?.customContent ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                      }}
                    >
                      {item?.customContent}
                    </View>
                  ) : (
                    <FlatList
                      style={styles.optionsList}
                      contentContainerStyle={styles.optionContent}
                      data={item?.options}
                      keyExtractor={(item) => item?.id}
                      ItemSeparatorComponent={ResponseSeparator}
                      showsVerticalScrollIndicator={true}
                      scrollEnabled
                      renderItem={(option) => (
                        <CustomButtom
                          isActive={form[item?.questionId] === option?.item?.id}
                          backgroundColor={
                            form[item?.questionId] === option?.item?.id
                              ? $white
                              : $primary
                          }
                          color={
                            form[item?.questionId] === option?.item?.id
                              ? $secondary
                              : $white
                          }
                          borderColor={
                            form[item?.questionId] === option?.item?.id
                              ? $secondary
                              : $white
                          }
                          key={option?.item?.id}
                          value={option?.item?.id}
                          variant="outlined"
                          onToggle={(activeValue) =>
                            handleChangeForm({
                              questionId: item?.questionId,
                              activeValue,
                            })
                          }
                        >
                          {option?.item?.label}
                        </CustomButtom>
                      )}
                    />
                  )}
                </View>
                <View style={styles.buttonGroup}>
                  {item?.id > 0 && (
                    <CustomButtom
                      width={$xxxlarge}
                      icon={() => <IconNavigatePrevious />}
                      backgroundColor={$secondary}
                      color={$white}
                      onPress={() => handleSlide({ type: 'previous' })}
                    />
                  )}
                  {questions?.length &&
                    item?.id < questions?.length - 1 &&
                    !!form[item?.questionId] && (
                      <CustomButtom
                        width={$xxxlarge}
                        icon={() => <IconNavigateNext />}
                        backgroundColor={$secondary}
                        color={$white}
                        onPress={() => handleSlide({ type: 'next' })}
                      />
                    )}
                  {item?.id === questions?.length - 1 &&
                    !!form[item?.questionId] && (
                      <CustomButtom
                        width="50%"
                        icon={() => <IconCheck />}
                        backgroundColor={$secondary}
                        color={$white}
                        onPress={() => onFinishQuestions(form, user)}
                      />
                    )}
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default QuestionsScreen;
