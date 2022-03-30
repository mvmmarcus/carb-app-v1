import React, { useState, useContext } from 'react';
import { ScrollView, Dimensions, View } from 'react-native';

import IconFA from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-select-dropdown';
import { Button, Dialog, IconButton } from 'react-native-paper';

import SearchFoodModal from '../SearchFoodModal';
import CustomButtom from '../CustomButton';
import BluetoothContext from '../../contexts/bluetooth';
import CustomText from '../CustomText';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const AddRegisterModal = ({ isOpen = false, onClose }) => {
  const { width } = Dimensions.get('screen');
  const { $secondary, $white } = theme;
  const styles = getStyle({ width });
  const [mealType, setMealType] = useState('Almoço');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openFoodModal, setOpenFoodModal] = useState(false);
  const { bloodGlucoses } = useContext(BluetoothContext);

  const onChangeDate = (event, selectedDate) => {
    console.log({ selectedDate });
    const currentDate = selectedDate;

    setShowDatePicker(false);
    setDate(currentDate);
  };

  console.log({ bloodGlucoses });

  const lastBloodGlucoseValue =
    bloodGlucoses?.length > 0 ? bloodGlucoses[bloodGlucoses?.length - 1] : null;

  return (
    <Dialog dismissable={false} style={styles.container} visible={isOpen}>
      <Dialog.ScrollArea style={styles.scrollArea}>
        <SearchFoodModal
          isOpen={openFoodModal}
          onClose={() => setOpenFoodModal(false)}
        />
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
        <ScrollView contentContainerStyle={styles.content}>
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
        </ScrollView>
        <CustomButtom
          style={styles.calcButton}
          backgroundColor={$secondary}
          color={$white}
          onPress={() => null}
        >
          Calcular insulina
        </CustomButtom>
      </Dialog.ScrollArea>
    </Dialog>
  );
};

export default AddRegisterModal;
