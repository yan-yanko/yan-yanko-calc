import { useState, useEffect } from 'react';
import { marketingPercentages } from '../data/marketingPercentages';

export const useBudgetCalculation = (annualRevenue, industry, customBudgetPercent, customBudgetValue) => {
  const [marketingBudget, setMarketingBudget] = useState(100000);

  useEffect(() => {
    if (!customBudgetPercent) {
      const selectedIndustryInfo = marketingPercentages.find(item => item.industry === industry);
      if (selectedIndustryInfo) {
        const recommendedBudget = Math.round(annualRevenue * (selectedIndustryInfo.percentage / 100));
        setMarketingBudget(recommendedBudget);
      }
    }
  }, [industry, annualRevenue, customBudgetPercent]);

  useEffect(() => {
    if (customBudgetPercent) {
      const calculatedBudget = Math.round(annualRevenue * (customBudgetValue / 100));
      setMarketingBudget(calculatedBudget);
    }
  }, [customBudgetValue, annualRevenue, customBudgetPercent]);

  return marketingBudget;
}; 