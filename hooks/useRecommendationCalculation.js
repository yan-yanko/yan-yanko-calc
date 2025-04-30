import { useState, useEffect } from 'react';
import { recommendationsData } from '../data/recommendationsData';
import { calculateFinalRecommendation } from '../utils/calculateRecommendation';

export const useRecommendationCalculation = (selectedValues, customAllocation, customAllocationValue) => {
  const [finalRecommendation, setFinalRecommendation] = useState({ brand: 60, performance: 40 });

  useEffect(() => {
    if (customAllocation) {
      setFinalRecommendation({
        brand: customAllocationValue,
        performance: 100 - customAllocationValue
      });
      return;
    }

    // חישוב ההמלצה בעזרת calculateFinalRecommendation
    const calculated = calculateFinalRecommendation(selectedValues);
    setFinalRecommendation(calculated);
  }, [selectedValues, customAllocation, customAllocationValue]);

  return finalRecommendation;
}; 