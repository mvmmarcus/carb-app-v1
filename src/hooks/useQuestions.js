import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';

import TargetRange from '#/components/TargetRange';

const useQuestions = ({ isChoCount = false, onChange }) => {
  const [questions, setQuestions] = useState(questionsWithoutCho);

  useEffect(() => {
    if (isChoCount) {
      setQuestions(questionsWithCho);
    } else {
      setQuestions(questionsWithoutCho);
    }
  }, [isChoCount]);

  const handleChange = useCallback(({ questionId, activeValue }) => {
    console.log({
      questionId,
      activeValue,
    });
    console.log('onChange: ', !!onChange);

    !!onChange && onChange({ questionId, activeValue });
  }, []);

  const questionsWithoutCho = [
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
        <TargetRange
          onValuesChange={(values) =>
            handleChange({ questionId: 'targetRange', activeValue: values })
          }
        />
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
      questionId: 'fixedDoses',
      question: 'Inserir doses fixas:',
      customContent: (
        <View>
          <Text>fixedDoses</Text>
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

  const questionsWithCho = [
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
        <TargetRange
          onValuesChange={(values) =>
            handleChange({ questionId: 'targetRange', activeValue: values })
          }
        />
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
      questionId: 'choInsulinRelationship',
      question: 'Qual sua relação insulina / CHO?',
      customContent: (
        <View>
          <Text>cutom</Text>
        </View>
      ),
    },
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

  return {
    questions,
  };
};

export default useQuestions;
