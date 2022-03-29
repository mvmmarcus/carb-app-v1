import React, { useState, useEffect, useCallback } from 'react';

import TargetRange from '../components/TargetRange';
import ListForm from '../components/ListForm';
import Input from '../components/Input';

const useQuestions = ({ isChoCount = false, onChange }) => {
  const [questions, setQuestions] = useState(questionsWithoutCho);

  useEffect(() => {
    if (isChoCount) {
      setQuestions(questionsWithCho);
    } else {
      setQuestions(questionsWithoutCho);
    }
  }, [isChoCount]);

  const handleUpdateForm = useCallback(({ questionId, activeValue }) => {
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
          id: 'type1',
        },
        {
          label: 'Tipo 2',
          id: 'type2',
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
            handleUpdateForm({ questionId: 'targetRange', activeValue: values })
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
          id: 'penSyringe',
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
      id: 4,
      questionId: 'fixedDoses',
      question: 'Inserir doses fixas:',
      customContent: (
        <ListForm
          onComplete={(values) =>
            handleUpdateForm({ questionId: 'fixedDoses', activeValue: values })
          }
          fields={[
            {
              id: 'morningUi',
              sufix: 'ui',
              title: 'Manha',
              subtitle: '(06:00 - 12:00)',
            },
            {
              id: 'afternoolUi',
              sufix: 'ui',
              title: 'Tarde',
              subtitle: '(12:00 - 18:00)',
            },
            {
              id: 'nightUi',
              sufix: 'ui',
              title: 'Noite',
              subtitle: '(18:00 - 00:00)',
            },
            {
              id: 'dawnUi',
              sufix: 'ui',
              title: 'Madrugada',
              subtitle: '(00:00 - 06:00)',
            },
          ]}
        />
      ),
    },
    {
      id: 5,
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
          label: 'Outro',
          id: 'other',
        },
      ],
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
          id: 'type1',
        },
        {
          label: 'Tipo 2',
          id: 'type2',
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
            handleUpdateForm({ questionId: 'targetRange', activeValue: values })
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
          id: 'penSyringe',
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
      id: 4,
      questionId: 'choInsulinRelationship',
      question: 'Qual sua relação insulina / CHO?',
      customContent: (
        <ListForm
          onComplete={(values) =>
            handleUpdateForm({
              questionId: 'choInsulinRelationship',
              activeValue: values,
            })
          }
          fields={[
            {
              id: 'morningCho',
              prefix: '1:',
              title: 'Manha',
              subtitle: '(06:00 - 12:00)',
            },
            {
              id: 'afternoolCho',
              prefix: '1:',
              title: 'Tarde',
              subtitle: '(12:00 - 18:00)',
            },
            {
              id: 'nightCho',
              prefix: '1:',
              title: 'Noite',
              subtitle: '(18:00 - 00:00)',
            },
            {
              id: 'dawnCho',
              prefix: '1:',
              title: 'Madrugada',
              subtitle: '(00:00 - 06:00)',
            },
          ]}
        />
      ),
    },
    {
      id: 5,
      questionId: 'correctionFactor',
      question: 'Qual seu fator de correção?',
      customContent: (
        <Input
          type="numeric"
          label="Fator de correção"
          placeholder="Digite seu fator de correção"
          onChange={(value) =>
            handleUpdateForm({
              questionId: 'correctionFactor',
              activeValue: value,
            })
          }
          labelStyles={{ paddingLeft: 0 }}
        />
      ),
    },
    {
      id: 6,
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
          label: 'Outro',
          id: 'other',
        },
      ],
    },
  ];

  return {
    questions,
  };
};

export default useQuestions;
