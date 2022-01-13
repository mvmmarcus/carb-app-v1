import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  View,
  Text,
  Dimensions,
  FlatList,
  SafeAreaView,
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
  const { width, height } = Dimensions.get('screen');

  const SEPARATOR_WIDTH = 24;

  const styles = getStyle({ width, height, SEPARATOR_WIDTH });

  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({
    type: null,
    targetRange: null,
    therapy: null,
    basalInsulin: null,
    fastInsulin: null,
    isChoCount: null,
    choInsulinRelationship: null,
    fixedDoses: null,
    correctionFactor: null,
    meter: null,
    sensor: null,
  });
  const flatListRef = useRef(null);
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length) setIndex(viewableItems[0]?.index);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 16 });

  const data = [
    {
      id: 0,
      questionId: 'type',
      question: 'Qual é seu tipo de diabetes?',
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
          label: 'Lada',
          id: 'lada',
        },
        {
          label: 'Gestacional',
          id: 'pregnant',
        },
        {
          label: 'Outro',
          id: 'other',
        },
      ],
    },
    {
      id: 1,
      questionId: 'targetRange',
      question: 'Qual é a sua faixa alvo?',
      customContent: (
        <View>
          <Text>cutom</Text>
        </View>
      ),
    },
    {
      id: 2,
      questionId: 'therapy',
      question: 'Qual a sua terapia para diabetes?',
      options: [
        {
          label: 'Caneta / Seringa',
          id: 'pen_syringe',
        },
        {
          label: 'Bomba',
          id: 'bomb',
        },
        {
          label: 'Sem insulina',
          id: 'withoutInsulin',
        },
      ],
    },
    {
      id: 3,
      questionId: 'basalInsulin',
      question: 'Selecionar insulina basal:',
      options: [
        {
          label: 'Lantus',
          id: 'lantus',
        },
        {
          label: 'Basaglar',
          id: 'basaglar',
        },
        {
          label: 'Levemir',
          id: 'levemir',
        },
        {
          label: 'Toujeo',
          id: 'toujeo',
        },
        {
          label: 'Tresiba',
          id: 'tresiba',
        },
      ],
    },
    {
      id: 4,
      questionId: 'fastInsulin',
      question: 'Selecionar insulina rápida:',
      options: [
        {
          label: 'Humalog',
          id: 'humalog',
        },
        {
          label: 'Novorapid',
          id: 'novorapid',
        },
        {
          label: 'Apidra',
          id: 'apidra',
        },
        {
          label: 'Fiasp',
          id: 'fiasp',
        },
      ],
    },
    {
      id: 5,
      questionId: 'isChoCount',
      question: 'Faz contagem de CHO?',
      options: [
        {
          label: 'Sim',
          id: 'yes',
        },
        {
          label: 'Não',
          id: 'no',
        },
      ],
    },
    {
      id: 6,
      questionId: form.isChoCount ? 'choInsulinRelationship' : 'fixedDoses',
      question: form.isChoCount
        ? 'Qual sua relação insulina / CHO?'
        : 'Inserir doses fixas:',
      customContent: (
        <View>
          <Text>cutom</Text>
        </View>
      ),
    },
    // mostrar apenas se fizer contagem de cho
    {
      id: 7,
      questionId: 'correctionFactor',
      question: 'Qual seu fator de correção?',
      customContent: (
        <View>
          <Text>cutom</Text>
        </View>
      ),
    },
    {
      id: 8,
      questionId: 'meter',
      question: 'Qual medidor você usa?',
      options: [
        {
          label: 'Accu-Chek Guide',
          id: 'accuChekGuide',
        },
        {
          label: 'Accu-Chek Guide Me',
          id: 'accuChekGuideMe',
        },
        {
          label: 'Accu-Chek Perfoma C.',
          id: 'accuChekPerfomaC',
        },
        {
          label: 'GlucoLeader',
          id: 'glucoLeader',
        },
        {
          label: 'OneCallPlus',
          id: 'oneCallPlus',
        },
      ],
    },
    {
      id: 9,
      questionId: 'sensor',
      question: 'Qual sensor você usa?',
      options: [
        {
          label: 'Enlite Sensor',
          id: 'enliteSensor',
        },
        {
          label: 'Eversense Sensor',
          id: 'eversenseSensor',
        },
        {
          label: 'Freestyle Libre',
          id: 'freestyleLibre',
        },
        {
          label: 'Guardian Sensor',
          id: 'guardianSensor',
        },
        {
          label: 'Outro',
          id: 'other',
        },
      ],
    },
    {
      id: 10,
      questionId: 'carbsUnitsSystem',
      question: 'Sistema de unidades utilizadas no Carbs:',
      customContent: (
        <View>
          <Text>cutom</Text>
        </View>
      ),
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

  const handleToggle = ({ questionId, activeValue }) => {
    console.log({ questionId, activeValue });

    setForm({
      ...form,
      [questionId]: activeValue,
    });
  };

  console.log('teste');

  const Separator = () => <View style={{ width: SEPARATOR_WIDTH }}></View>;

  const ResponseSeparator = () => <View style={{ height: 16 }}></View>;

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
              <FlatList
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
                      <CustomText weight="medium" style={styles.questionText}>
                        {item?.question}
                      </CustomText>
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
                            isActive={
                              form[item?.questionId] === option?.item?.id
                            }
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
                              handleToggle({
                                questionId: item?.questionId,
                                activeValue,
                              })
                            }
                          >
                            {option?.item?.label}
                          </CustomButtom>
                        )}
                      />
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
                      {data?.length && item?.id < data?.length - 1 && (
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
