import React, { useState, useContext } from 'react';
import { ScrollView, Dimensions, View } from 'react-native';

import IconFA from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-select-dropdown';
import { Button, Dialog, IconButton, List } from 'react-native-paper';

import Input from '../Input';
import IconDataNotFound from '../../../assets/data_not_found.svg';
import FallbackMessage from '../FallbackMessage';
import SearchFoodModal from '../SearchFoodModal';
import CustomButtom from '../CustomButton';
import BluetoothContext from '../../contexts/bluetooth';
import UserContext from '../../contexts/user';
import CustomText from '../CustomText';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const AddRegisterModal = ({ isOpen = false, onClose }) => {
  const { width } = Dimensions.get('screen');
  const { $secondary, $white, $red } = theme;
  const styles = getStyle({ width });
  const [mealType, setMealType] = useState('Almoço');
  const [foodAccordionId, setFoodAccordionId] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openFoodModal, setOpenFoodModal] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [updatedSelectedFoods, setUpdatedSelectedFoods] = useState([]);
  const [editablesFoods, setEditablesFoods] = useState([]);
  const { bloodGlucoses } = useContext(BluetoothContext);
  const { insulinParams } = useContext(UserContext);

  const onChangeDate = (event, selectedDate) => {
    console.log({ selectedDate });
    const currentDate = selectedDate;

    setShowDatePicker(false);
    setDate(currentDate);
  };

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

  console.log({ bloodGlucoses });

  const lastBloodGlucoseValue =
    bloodGlucoses?.length > 0 ? bloodGlucoses[bloodGlucoses?.length - 1] : null;

  const totalCho = selectedFoods?.reduce(
    (total, curr) => total + curr?.cho?.value,
    0
  );

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
        {bloodGlucoses?.length > 0 ? (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.scrollAreaContent}>
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
                    {lastBloodGlucoseValue?.time}
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
                    {new Date(lastBloodGlucoseValue?.date)?.toLocaleString(
                      'pt-BR',
                      {
                        dateStyle: 'short',
                      }
                    )}
                    {/* <IconFA name="caret-down" size={14} /> */}
                  </Button>
                  {showDatePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={onChangeDate}
                    />
                  )}
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
                    defaultValue={mealType}
                    data={['Almoço', 'Lanche', 'Jantar']}
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
                  <CustomText weight="bold" style={styles.text}>
                    {!!lastBloodGlucoseValue
                      ? `${lastBloodGlucoseValue?.value} mg/dL`
                      : '-'}
                  </CustomText>
                </View>
                <View style={styles.diviser} />

                <View style={styles.infoRow}>
                  <CustomText weight="bold" style={styles.text}>
                    Insulina (refeição):
                  </CustomText>
                  <CustomText weight="bold" style={styles.text}>
                    2 ui
                  </CustomText>
                </View>
                <View style={styles.diviser} />
                <View style={styles.infoRow}>
                  <CustomText weight="bold" style={styles.text}>
                    Insulina (correção):
                  </CustomText>
                  <CustomText weight="bold" style={styles.text}>
                    1 ui
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
                                    {food?.cho?.value}g
                                  </CustomText>
                                </CustomText>
                              </View>
                              <Input
                                value={food?.cho?.defaultGramPortion}
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
            {selectedFoods?.length > 0 && (
              <CustomButtom
                style={styles.calcButton}
                backgroundColor={$secondary}
                color={$white}
                onPress={() => {
                  alert(
                    JSON.stringify({
                      lastBloodGlucoseValue,
                      totalCho,
                      insulinParams,
                    })
                  );
                }}
              >
                Calcular insulina
              </CustomButtom>
            )}
          </ScrollView>
        ) : (
          <FallbackMessage
            style={styles.fallbackContainer}
            customIcon={
              <IconDataNotFound color={$secondary} width={100} height={100} />
            }
            title="Nenhum registro de glicemia encontrado"
            subtitle="Sincronize o seu medidor de glicemia para obter os registros e calcular a insulina"
          />
        )}
      </Dialog.ScrollArea>
    </Dialog>
  );
};

export default AddRegisterModal;
