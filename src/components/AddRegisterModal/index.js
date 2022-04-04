import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, Dimensions, View, TextInput } from 'react-native';

import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-community/async-storage';
import IconFA from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-select-dropdown';
import { Button, Dialog, IconButton, List } from 'react-native-paper';

import Alert from '../Alert';
import Input from '../Input';
import SearchFoodModal from '../SearchFoodModal';
import CustomButtom from '../CustomButton';
import BluetoothContext from '../../contexts/bluetooth';
import UserContext from '../../contexts/user';
import useAuth from '../../hooks/useAuth';
import CustomText from '../CustomText';
import { convertNumberToString } from '../../utils/global';
import { jsonParse } from '../../utils/jsonParse';
import {
  calculateCorrectionInsulin,
  calculateFoodInsulin,
} from '../../utils/bloodGlucose';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';
import { sortByDateAndTime } from '../../utils/date';

const AddRegisterModal = ({ isOpen = false, onClose }) => {
  const { width } = Dimensions.get('screen');
  const { $secondary, $white, $red } = theme;
  const styles = getStyle({ width });
  const [mealType, setMealType] = useState('');
  const [foodAccordionId, setFoodAccordionId] = useState('');
  const [customBloodGlucoseValue, setCustomBloodGlucoseValue] = useState('');
  const [openFoodModal, setOpenFoodModal] = useState(false);
  const [isSavingRegister, setIsSavingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [updatedSelectedFoods, setUpdatedSelectedFoods] = useState([]);
  const [editablesFoods, setEditablesFoods] = useState([]);
  const [lastBloodGlucose, setLastBloodGlucose] = useState([]);
  const [activeNav, setActiveNav] = useState('Adicionar glicemia manual');
  const [availableNavs, setAvailableNavs] = useState([
    'Adicionar glicemia manual',
  ]);

  const { bloodGlucoses, isGettingBloodGlucoses, setBloodGlucoses } =
    useContext(BluetoothContext);
  const { insulinParams } = useContext(UserContext);
  const { user } = useAuth();

  const totalCho = selectedFoods?.reduce(
    (total, curr) => total + curr?.cho?.value,
    0
  );

  useEffect(() => {
    const fromMeterGlucoses = bloodGlucoses
      ?.sort(sortByDateAndTime)
      ?.filter((item) => item?.isFromMeter === true);
    const lastBloodGlucoseFromMeter =
      fromMeterGlucoses?.length > 0 ? fromMeterGlucoses[0] : null;
    setLastBloodGlucose(lastBloodGlucoseFromMeter);
    if (!!lastBloodGlucoseFromMeter) {
      setAvailableNavs([
        'Adicionar glicemia manual',
        'Usar última leitura do medidor',
      ]);
      setActiveNav('Usar última leitura do medidor');
    }
    setIsLoading(false);
  }, [bloodGlucoses]);

  useEffect(() => {
    if (activeNav === 'Usar última leitura do medidor') {
      setSelectedFoods(lastBloodGlucose?.selectedFoods || []);
      setMealType(lastBloodGlucose?.type);
    } else {
      setSelectedFoods([]);
      setEditablesFoods([]);
      setUpdatedSelectedFoods([]);
      setMealType('');
      setCustomBloodGlucoseValue('');
    }
  }, [lastBloodGlucose, activeNav]);

  const handleAddFoods = (addedFoods) => {
    setSelectedFoods(addedFoods);
    setFoodAccordionId('Alimentos selecionados');
  };

  const toggleAccordionPress = (expandedId) => {
    if (foodAccordionId === expandedId) setFoodAccordionId('');
    else setFoodAccordionId(expandedId);
  };

  const handlePortionChange = (foods = [], food, newPortion) => {
    const updatedFoods = foods?.map((item) => {
      if (item?.fdcId === food?.fdcId) {
        const foodDefaultPortion = 100; // 100g
        const currentCho = food?.cho?.defaultValue;

        return {
          ...item,
          cho: {
            ...item?.cho,
            value: (Number(newPortion) * currentCho) / foodDefaultPortion,
            gramPortion: newPortion,
          },
        };
      }

      return item;
    });

    const isFoodAdded = (food = {}, selectedFoodsIds = []) => {
      return !!selectedFoodsIds?.find((item) => item === food?.fdcId);
    };

    setEditablesFoods((prev) => {
      if (isFoodAdded(food, prev)) {
        return prev;
      } else {
        return [...prev, food?.fdcId];
      }
    });
    setUpdatedSelectedFoods(updatedFoods);
  };

  const handleFoodSave = (savedFood, updatedFoods = [], oldFoods = []) => {
    const updatedSelectedFoods = oldFoods?.map((item) => {
      if (item?.fdcId === savedFood?.fdcId) {
        const updatedFood = updatedFoods.find(
          (updatedFood) => updatedFood?.fdcId === savedFood?.fdcId
        );

        return updatedFood;
      }

      return item;
    });

    setSelectedFoods(updatedSelectedFoods);
    setEditablesFoods((prev) =>
      prev?.filter((item) => item !== savedFood?.fdcId)
    );
  };

  const handleDeleteFood = (food, selectedFoods = []) => {
    const filteredFoods = selectedFoods?.filter(
      (item) => item?.fdcId !== food?.fdcId
    );

    setSelectedFoods(filteredFoods);

    setUpdatedSelectedFoods((prev) => {
      const filteredFoods = prev?.filter((item) => item?.fdcId !== food?.fdcId);
      return filteredFoods;
    });
    setEditablesFoods((prev) => {
      const filteredFoods = prev?.filter((item) => item !== food?.fdcId);
      return filteredFoods;
    });
  };

  const handleCalculateInsulin = async (
    foodInsulin,
    correctionInsulin,
    user,
    bloodGlucoses = [],
    totalCho,
    mealType,
    selectedFoods = [],
    lastBloodGlucose,
    isBloodGlucoseFromMeter = false,
    customGlucose
  ) => {
    setIsSavingRegister(true);
    try {
      let updatedBloodGlucoses = [];

      if (isBloodGlucoseFromMeter) {
        updatedBloodGlucoses = bloodGlucoses?.map((item) => {
          if (item?.fullDate === lastBloodGlucose?.fullDate) {
            return {
              ...item,
              insulin: foodInsulin,
              correction: correctionInsulin,
              carbs: parseFloat(totalCho?.toFixed(2)),
              type: mealType,
              selectedFoods,
            };
          }

          return item;
        });
      } else {
        const splittedDate = customGlucose?.date?.split('/');
        const day = splittedDate[0];
        const month = splittedDate[1];
        const year = splittedDate[2];
        const utcDate = `${year}/${month}/${day}`;
        const utcFullDate = `${utcDate} ${customGlucose?.time}`;

        const formattedCustomGlucose = {
          date: utcDate,
          fullDate: utcFullDate,
          time: customGlucose?.time,
          value: parseFloat(customGlucose?.value),
          insulin: foodInsulin,
          correction: correctionInsulin,
          carbs: parseFloat(totalCho?.toFixed(2)),
          type: mealType,
          selectedFoods,
          isFromMeter: false,
          id: uuid.v4(),
        };

        if (bloodGlucoses?.length > 0) {
          updatedBloodGlucoses = [...bloodGlucoses, formattedCustomGlucose];
        } else {
          updatedBloodGlucoses = [formattedCustomGlucose];
        }
      }

      const userInfosByUid = jsonParse(
        await AsyncStorage.getItem(`@carbs:${user?.uid}`)
      );

      await AsyncStorage.setItem(
        `@carbs:${user?.uid}`,
        JSON.stringify({
          ...userInfosByUid,
          bloodGlucoses: updatedBloodGlucoses,
        })
      );

      setBloodGlucoses(updatedBloodGlucoses);

      Toast.show({
        type: 'success',
        text1: 'Registro salvo!',
      });

      !!onClose && onClose();
    } catch (error) {
      console.log('handleCalculateInsulin error: ', error);
    } finally {
      setIsSavingRegister(false);
    }
  };

  const getRegisterTime = (lastBloodGlucose, isBloodGlucoseFromMeter) => {
    if (isBloodGlucoseFromMeter) {
      return lastBloodGlucose?.time;
    }

    const today = new Date();
    const hour = convertNumberToString(today?.getHours());
    const minutes = convertNumberToString(today?.getMinutes());
    const seconds = convertNumberToString(today?.getSeconds());
    const time = `${hour}:${minutes}:${seconds}`;

    return time;
  };

  const getRegisterDate = (lastBloodGlucose, isBloodGlucoseFromMeter) => {
    const date = isBloodGlucoseFromMeter
      ? new Date(lastBloodGlucose?.date)
      : new Date();
    const day = convertNumberToString(date?.getDate());
    const month = convertNumberToString(date?.getMonth() + 1);
    const fullYear = date?.getFullYear();
    const formattedDate = `${day}/${month}/${fullYear}`;

    return formattedDate;
  };

  const getCorrectionInsulin = (
    lastBloodGlucose,
    customBloodGlucose,
    insulinParams,
    isBloodGlucoseFromMeter
  ) => {
    // Validar se o usuário sincronizou o app com o medidor
    if (isBloodGlucoseFromMeter) {
      // Se sincronizou com o medidor, utilizar a última aferição de glicose no cálculo
      const correctionInsulin = calculateCorrectionInsulin(
        lastBloodGlucose?.value,
        insulinParams
      );
      return parseFloat(correctionInsulin) || 0;
    }

    // Se não sincronizou, utilizar o valor de glicose inserido pelo usuário
    // Dessa forma, usuários que não possuem medidores com tecnologia bluetooth também conseguem usar o app
    const correctionInsulin = calculateCorrectionInsulin(
      customBloodGlucose,
      insulinParams
    );

    return parseFloat(correctionInsulin) || 0;
  };

  const correctionInsulin = getCorrectionInsulin(
    lastBloodGlucose,
    customBloodGlucoseValue,
    insulinParams,
    activeNav === 'Usar última leitura do medidor'
  );

  const foodInsulin = calculateFoodInsulin(
    totalCho,
    insulinParams?.choInsulinRelationship
  );

  const showSaveButton = selectedFoods?.length > 0 || !!customBloodGlucoseValue;

  return (
    <Dialog dismissable={false} style={styles.container} visible={isOpen}>
      <Dialog.ScrollArea style={styles.scrollArea}>
        {openFoodModal && (
          <SearchFoodModal
            isOpen={openFoodModal}
            initialSelectedFoods={selectedFoods}
            onClose={() => setOpenFoodModal(false)}
            onAddFoods={handleAddFoods}
          />
        )}
        <View style={styles.header}>
          <IconButton
            style={styles.closeButton}
            color={$secondary}
            icon="close"
            onPress={onClose}
          />
          <CustomText weight="bold" style={styles.headerTitle}>
            Adicionar Registro
          </CustomText>
        </View>

        {(isLoading || isGettingBloodGlucoses) && (
          <Alert message="Atualizando registros" />
        )}

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.scrollAreaContent}>
            <View style={styles.timeContainer}>
              <CustomText
                weight="bold"
                style={{ ...styles.text, marginBottom: 10 }}
              >
                Fonte da glicemia
              </CustomText>
              <View style={styles.buttonsRow}>
                <DropDownPicker
                  defaultButtonText={activeNav}
                  data={availableNavs}
                  onSelect={setActiveNav}
                  rowStyle={styles.dropdownRow}
                  rowTextStyle={styles.dropdownRowText}
                  buttonStyle={styles.buttonFullWidth}
                  buttonTextStyle={styles.buttonLabel}
                  dropdownIconPosition="right"
                  renderDropdownIcon={() => (
                    <IconFA name="caret-down" size={14} color={$secondary} />
                  )}
                />
              </View>
            </View>
            <View style={styles.timeContainer}>
              <CustomText
                weight="bold"
                style={{ ...styles.text, marginBottom: 10 }}
              >
                Horário
              </CustomText>
              <View style={styles.buttonsRow}>
                <Button
                  style={{ ...styles.button, marginRight: 10 }}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon="clock-time-four-outline"
                >
                  {getRegisterTime(
                    lastBloodGlucose,
                    activeNav === 'Usar última leitura do medidor'
                  )}
                </Button>
                <Button
                  // onPress={() => setShowDatePicker(true)}
                  uppercase={false}
                  mode="contained"
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon="calendar"
                >
                  {getRegisterDate(
                    lastBloodGlucose,
                    activeNav === 'Usar última leitura do medidor'
                  )}
                </Button>
              </View>
            </View>
            <View style={styles.timeContainer}>
              <CustomText
                weight="bold"
                style={{ ...styles.text, marginBottom: 10 }}
              >
                Refeição
              </CustomText>
              <View style={styles.buttonsRow}>
                <Button
                  style={{ ...styles.buttonFullWidth, marginRight: 10 }}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon="book-open-variant"
                  uppercase={false}
                  onPress={() => setOpenFoodModal(true)}
                >
                  Adicionar alimento
                </Button>
                <DropDownPicker
                  defaultButtonText="Tipo da refeição"
                  data={['Café da manha', 'Almoço', 'Lanche', 'Jantar']}
                  onSelect={setMealType}
                  rowStyle={styles.dropdownRow}
                  rowTextStyle={styles.dropdownRowText}
                  buttonStyle={styles.buttonFullWidth}
                  buttonTextStyle={styles.buttonLabel}
                  dropdownIconPosition="right"
                  renderDropdownIcon={() => (
                    <IconFA name="caret-down" size={14} color={$secondary} />
                  )}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <CustomText weight="bold" style={styles.text}>
                  Glicemia:
                </CustomText>

                {activeNav === 'Usar última leitura do medidor' ? (
                  <CustomText weight="bold" style={styles.text}>
                    {lastBloodGlucose?.value} mg/dL
                  </CustomText>
                ) : (
                  <View style={styles.customBloodGlucose}>
                    <TextInput
                      style={styles.bloodGlucoseInput}
                      value={customBloodGlucoseValue}
                      keyboardType="numeric"
                      placeholder="100"
                      onChangeText={(value) =>
                        setCustomBloodGlucoseValue(value)
                      }
                    />
                    <CustomText weight="bold" style={styles.text}>
                      mg/dL
                    </CustomText>
                  </View>
                )}
              </View>
              <View style={styles.diviser} />

              <View style={styles.infoRow}>
                <CustomText weight="bold" style={styles.text}>
                  Bolus:
                </CustomText>
                <CustomText weight="bold" style={styles.text}>
                  {foodInsulin} ui
                </CustomText>
              </View>
              <View style={styles.diviser} />
              <View style={styles.infoRow}>
                <CustomText weight="bold" style={styles.text}>
                  Correção:
                </CustomText>
                <CustomText weight="bold" style={styles.text}>
                  {correctionInsulin} ui
                </CustomText>
              </View>
              <View style={styles.diviser} />
              <View style={styles.infoRow}>
                <CustomText weight="bold" style={styles.text}>
                  Total
                </CustomText>
                <CustomText weight="bold" style={styles.totalInsulin}>
                  {parseFloat((correctionInsulin + foodInsulin)?.toFixed(2))} ui
                </CustomText>
              </View>
            </View>

            {selectedFoods?.length > 0 && (
              <List.AccordionGroup
                expandedId={foodAccordionId}
                onAccordionPress={toggleAccordionPress}
              >
                <View style={styles.accordionContainer}>
                  <List.Accordion
                    theme={{
                      colors: { text: $white },
                    }}
                    left={() => (
                      <List.Icon
                        color={$white}
                        style={styles.iconLeft}
                        icon="food"
                      />
                    )}
                    style={styles.accordion}
                    titleStyle={styles.accordionTitle}
                    descriptionStyle={styles.accordionDescription}
                    title={`Alimentos selecionados (${selectedFoods?.length})`}
                    description={`Total CHO: ${totalCho?.toFixed(2)}g`}
                    id={'Alimentos selecionados'}
                  >
                    <View style={styles.accordionItem}>
                      {selectedFoods?.map((food, index) => (
                        <React.Fragment key={food?.fdcId}>
                          <View style={styles.food}>
                            <View style={styles.foodNameContainer}>
                              <CustomText
                                weight="medium"
                                style={styles.foodName}
                              >
                                {index + 1}. {food?.description}
                              </CustomText>
                              <CustomText style={styles.foodName}>
                                CHO:{' '}
                                <CustomText
                                  weight="bold"
                                  style={styles.foodName}
                                >
                                  {food?.cho?.value?.toFixed(2)}g
                                </CustomText>
                              </CustomText>
                            </View>
                            <Input
                              value={food?.cho?.gramPortion}
                              type="numeric"
                              labelStyles={styles.portionInputLabel}
                              labelTextStyles={styles.portionInputLabelText}
                              label="Porção (g)"
                              placeholder="Ex: 100"
                              onChange={(newPortion) =>
                                handlePortionChange(
                                  selectedFoods,
                                  food,
                                  newPortion
                                )
                              }
                            />
                            <View style={styles.iconGroup}>
                              {editablesFoods?.includes(food?.fdcId) && (
                                <IconButton
                                  icon="check"
                                  color={$secondary}
                                  onPress={() =>
                                    handleFoodSave(
                                      food,
                                      updatedSelectedFoods,
                                      selectedFoods
                                    )
                                  }
                                  size={20}
                                  style={styles.iconEdit}
                                />
                              )}
                              <IconButton
                                icon="delete"
                                color={$red}
                                onPress={() =>
                                  handleDeleteFood(food, selectedFoods)
                                }
                                size={20}
                                style={styles.iconDelete}
                              />
                            </View>
                          </View>
                          {selectedFoods?.length - 1 !== index && (
                            <View style={styles.diviser} />
                          )}
                        </React.Fragment>
                      ))}
                    </View>
                  </List.Accordion>
                </View>
              </List.AccordionGroup>
            )}
          </View>
          {showSaveButton && (
            <CustomButtom
              isLoading={isSavingRegister}
              style={styles.calcButton}
              backgroundColor={$secondary}
              color={$white}
              onPress={() =>
                handleCalculateInsulin(
                  foodInsulin,
                  correctionInsulin,
                  user,
                  bloodGlucoses,
                  totalCho,
                  mealType,
                  selectedFoods,
                  lastBloodGlucose,
                  activeNav === 'Usar última leitura do medidor',
                  {
                    time: getRegisterTime(
                      lastBloodGlucose,
                      activeNav === 'Usar última leitura do medidor'
                    ),
                    date: getRegisterDate(
                      lastBloodGlucose,
                      activeNav === 'Usar última leitura do medidor'
                    ),
                    value: customBloodGlucoseValue,
                  }
                )
              }
            >
              {isSavingRegister ? '' : 'Salvar registro'}
            </CustomButtom>
          )}
        </ScrollView>
      </Dialog.ScrollArea>
    </Dialog>
  );
};

export default AddRegisterModal;
