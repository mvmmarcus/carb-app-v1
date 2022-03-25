import React from 'react';
import { View } from 'react-native';

import { List } from 'react-native-paper';

import Meal from '../Meal';

import { theme } from '#/styles/theme';
import { getStyle } from './styles';

const MealAccordion = ({ title = '', id = '1', meals = [] }) => {
  const styles = getStyle({});
  const { $white } = theme;

  return (
    <List.AccordionGroup>
      <View style={styles.container}>
        <List.Accordion
          theme={{
            colors: { text: $white },
          }}
          left={() => (
            <List.Icon color={$white} style={styles.iconLeft} icon="calendar" />
          )}
          style={styles.accordion}
          titleStyle={styles.accordionTitle}
          title={title}
          id={String(id)}
        >
          <View style={styles.accordionItem}>
            {meals?.map((meal) => (
              <Meal key={meal?.id} {...meal} />
            ))}
          </View>
        </List.Accordion>
      </View>
    </List.AccordionGroup>
  );
};

export default MealAccordion;
