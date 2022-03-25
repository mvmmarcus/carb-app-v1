import React from 'react';
import { ScrollView, View } from 'react-native';

import { IconButton } from 'react-native-paper';

import IconTime from '#/../assets/time.svg';
import CustomText from '../CustomText';
import { getBackgroundColor } from '../../utils/global';

import { theme } from '#/styles/theme';
import { getStyle } from './styles';

const Meal = ({
  glucose = '-',
  carbs = '-',
  insulin = '-',
  correction = '-',
  time = '-',
  type = '-',
}) => {
  const styles = getStyle({
    glucoseBadgeBg: getBackgroundColor(glucose),
  });
  const { $secondary, $white } = theme;

  const mealInfos = [
    {
      title: 'Glicose',
      value: glucose,
      unity: 'mg/dL',
      isFirst: true,
    },
    {
      title: 'Carbs',
      value: carbs,
      unity: 'g',
    },
    {
      title: 'Insulina',
      value: insulin,
      unity: 'ui',
    },
    {
      title: 'Correção',
      value: correction,
      unity: 'ui',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.timeBox}>
        <IconTime />
        <CustomText weight="medium" style={styles.mealType}>
          {type}
        </CustomText>
        <CustomText weight="bold" style={styles.mealHour}>
          {time}
        </CustomText>
      </View>
      <View style={styles.diviserBox}>
        <View style={styles.diviserLine} />
        <View style={styles.diviserCircle} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        style={styles.mealInfosBox}
        contentContainerStyle={styles.mealInfosBoxContentScroll}
      >
        {mealInfos.map(({ title, isFirst, unity, value }) => {
          const badgeStyles = isFirst
            ? { ...styles.mealItemGlucoseBdge, minWidth: 84 }
            : styles.mealItemBadge;

          return (
            <View
              key={title}
              style={{ ...styles.mealItem, marginLeft: isFirst ? 0 : 8 }}
            >
              <CustomText weight="bold" style={styles.mealItemTitle}>
                {title}
              </CustomText>
              <View style={badgeStyles}>
                <CustomText
                  weight="bold"
                  style={{
                    ...styles.mealItemValue,
                    color: isFirst ? $white : $secondary,
                  }}
                >
                  {value}
                </CustomText>
                <CustomText
                  weight="medium"
                  style={{
                    ...styles.mealItemUnity,
                    color: isFirst ? $white : $secondary,
                  }}
                >
                  {unity}
                </CustomText>
              </View>
            </View>
          );
        })}
        {type !== '-' && (
          <IconButton
            icon="pencil"
            color={$white}
            onPress={() => null}
            size={20}
            style={styles.iconEdit}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Meal;
