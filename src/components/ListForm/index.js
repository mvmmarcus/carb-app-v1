import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';

import CustomText from '../CustomText';

import colors from '#/styles/colors';
import { getStyle } from './styles';

const ListForm = ({ fields = [], initialValues = {}, onComplete }) => {
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    const { isFormValid } = validateFields(formValues);

    if (isFormValid) {
      !!onComplete && onComplete(formValues);
    }

    console.log({ formValues, isFormValid });
  }, [formValues]);

  const validateFields = (formValues) => {
    let isFormValid = true;

    fields.forEach((field) => {
      if (!formValues[field?.id]) {
        isFormValid = false;
      }
    });

    return {
      isFormValid,
    };
  };

  const handleChange = (value, field) => {
    setFormValues((prev) => {
      return {
        ...prev,
        [field?.id]: value,
      };
    });
  };

  const styles = getStyle({});

  return (
    <>
      <CustomText style={styles.alert}>
        Preencha as informações abaixo para prosseguir:
      </CustomText>
      <View style={styles.container}>
        <View style={styles.list}>
          {fields.map((field) => (
            <View key={field?.id} style={styles.row}>
              <View style={styles.inputContainer}>
                {!!field?.prefix && (
                  <CustomText weight="bold" style={styles.text}>
                    {field?.prefix}
                  </CustomText>
                )}

                <TextInput
                  selectionColor={colors.$white}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  style={styles.input}
                  keyboardType="numeric"
                  value={formValues[field?.id]}
                  onChangeText={(value) => handleChange(value, field)}
                />
                {!!field?.sufix && (
                  <CustomText weight="bold" style={styles.text}>
                    {field?.sufix}
                  </CustomText>
                )}
                <CustomText weight="bold" style={styles.marker}>
                  .
                </CustomText>
              </View>
              <View style={styles.fieldContainer}>
                <CustomText weight="bold" style={styles.text}>
                  {field?.title}
                </CustomText>
                <CustomText weight="bold" style={styles.subtext}>
                  {field?.subtitle}
                </CustomText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

export default ListForm;
