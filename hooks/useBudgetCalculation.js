import { useMemo } from 'react';
import { calculateMarketingBudget } from '../utils/calculateMarketingBudget';

/**
 * @typedef {Object} BudgetCalculationInputs
 * @property {number} annualRevenue - מחזור מכירות שנתי
 * @property {string} industry - תחום העסק
 * @property {boolean} customBudgetPercent - האם להשתמש באחוז תקציב מותאם אישית
 * @property {number} customBudgetValue - אחוז התקציב המותאם אישית
 * @property {string} operationArea - אזור פעילות
 * @property {string} audienceSize - גודל קהל פוטנציאלי
 */

/**
 * חישוב תקציב שיווק מומלץ על בסיס פרמטרים שונים
 * @param {BudgetCalculationInputs} props - הפרמטרים של הפונקציה
 * @returns {number|null} - התקציב המחושב או null אם לא ניתן לחשב
 */
export const useBudgetCalculation = (inputs) => {
  const marketingBudget = useMemo(() => {
    return calculateMarketingBudget(inputs);
  }, [
    inputs.annualRevenue,
    inputs.industry,
    inputs.customBudgetPercent,
    inputs.customBudgetValue,
    inputs.operationArea,
    inputs.audienceSize
  ]);

  return marketingBudget;
}; 