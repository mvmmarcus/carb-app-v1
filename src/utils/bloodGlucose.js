// Cálculo da insulina de correção (com base na glicemia aferida)
export const calculateCorrectionInsulin = (bloodGlucose, insulinParams) => {
  const bloodGlucoseTarget = 100; // 100 mg/dL
  const correctionInsulin =
    (bloodGlucose - bloodGlucoseTarget) /
    Number(insulinParams?.correctionFactor);

  return correctionInsulin > 0 ? correctionInsulin?.toFixed(1) : 0;
};

// Cálculo da insulina com base no total de carboidratos da refeição
export const calculateFoodInsulin = (totalCho, choInsulinRelationship) => {
  let currentPeriod = '';
  const today = new Date();
  const hour = today?.getHours();

  if (hour >= 0 && hour < 6) {
    currentPeriod = 'dawnCho';
  } else if (hour >= 6 && hour < 12) {
    currentPeriod = 'morningCho';
  } else if (hour >= 12 && hour < 18) {
    currentPeriod = 'afternoolCho';
  } else {
    currentPeriod = 'nightCho';
  }

  const foodInsulin =
    parseFloat(totalCho?.toFixed(2)) /
    parseFloat(choInsulinRelationship[currentPeriod]);

  return parseFloat(foodInsulin?.toFixed(1)) || 0;
};
