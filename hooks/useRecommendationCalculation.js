import { useState, useEffect } from 'react';
import { recommendationsData } from '../data/recommendationsData';

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
    
    if (Object.keys(selectedValues).length === 0) {
      setFinalRecommendation({ brand: 60, performance: 40 });
      return;
    }
    
    let totalBrand = 0;
    let count = 0;
    
    for (const dimension in selectedValues) {
      totalBrand += selectedValues[dimension].brand;
      count++;
    }
    
    const avgBrand = Math.round(totalBrand / count);
    const avgPerf = 100 - avgBrand;
    
    setFinalRecommendation({
      brand: avgBrand,
      performance: avgPerf
    });
  }, [selectedValues, customAllocation, customAllocationValue]);

  return finalRecommendation;
}; 