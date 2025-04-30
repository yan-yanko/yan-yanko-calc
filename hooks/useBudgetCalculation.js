import { useState, useEffect } from 'react';
import { marketingPercentages } from '../data/marketingPercentages';
import { areaMultipliers, audienceSizeMultipliers } from '../data/constants';

export const useBudgetCalculation = (annualRevenue, industry, customBudgetPercent, customBudgetValue, operationArea, audienceSize) => {
  const [marketingBudget, setMarketingBudget] = useState(100000);

  useEffect(() => {
    if (!customBudgetPercent) {
      const selectedIndustryInfo = marketingPercentages.find(item => item.industry === industry);
      if (selectedIndustryInfo) {
        const areaMultiplier = areaMultipliers[operationArea] || 1;
        const audienceMultiplier = audienceSizeMultipliers[audienceSize] || 1;
        const recommendedBudget = Math.round(annualRevenue * (selectedIndustryInfo.percentage / 100) * areaMultiplier * audienceMultiplier);
        setMarketingBudget(recommendedBudget);
      }
    }
  }, [industry, annualRevenue, customBudgetPercent, operationArea, audienceSize]);

  useEffect(() => {
    if (customBudgetPercent) {
      const calculatedBudget = Math.round(annualRevenue * (customBudgetValue / 100));
      setMarketingBudget(calculatedBudget);
    }
  }, [customBudgetValue, annualRevenue, customBudgetPercent]);

  return marketingBudget;
}; 