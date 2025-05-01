import { marketingPercentages } from '../data/marketingPercentages';
import { areaMultipliers, audienceSizeMultipliers } from '../data/constants';

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
 * חישוב תקציב השיווק המומלץ לפי פרמטרים שונים
 * @param {Object} params - פרמטרים לחישוב התקציב
 * @param {number} params.annualRevenue - מחזור מכירות שנתי
 * @param {string} params.industry - תחום העסק
 * @param {boolean} params.customBudgetPercent - האם להשתמש באחוז מותאם אישית
 * @param {number} params.customBudgetValue - אחוז התקציב המותאם אישית
 * @param {string} params.operationArea - אזור פעילות העסק
 * @param {string} params.audienceSize - גודל קהל היעד
 * @returns {number|null} תקציב השיווק המחושב או null אם חסרים פרמטרים
 */
export const calculateMarketingBudget = ({
  annualRevenue,
  industry,
  customBudgetPercent,
  customBudgetValue,
  operationArea,
  audienceSize
}) => {
  // בדיקת פרמטרים חיוניים
  if (!annualRevenue || annualRevenue <= 0) {
    return null;
  }

  if (!industry) {
    return null;
  }

  if (!operationArea) {
    return null;
  }

  if (!audienceSize) {
    return null;
  }

  // חישוב אחוז בסיסי לפי תחום העסק
  const industryPercentage = getIndustryPercentage(industry);
  if (industryPercentage === null) {
    return null;
  }

  // אם יש אחוז מותאם אישית, נשתמש בו במקום האחוז לפי תחום העסק
  const basePercentage = customBudgetPercent ? customBudgetValue : industryPercentage;

  // חישוב מכפילים לפי אזור פעילות וגודל קהל יעד
  const areaMultiplier = getAreaMultiplier(operationArea);
  const audienceSizeMultiplier = getAudienceSizeMultiplier(audienceSize);

  // חישוב סופי
  const finalPercentage = basePercentage * areaMultiplier * audienceSizeMultiplier;
  const marketingBudget = Math.round(annualRevenue * (finalPercentage / 100));

  return marketingBudget;
};

/**
 * מקבל את אחוז השיווק הממוצע לתחום עסקי
 * @param {string} industry - תחום העסק
 * @returns {number|null} אחוז התקציב המומלץ או null אם התחום לא נמצא
 */
function getIndustryPercentage(industry) {
  const industryMap = {
    "חברות תוכנה / SaaS / טכנולוגיה": 15,
    "קמעונאות אונליין": 10,
    "קמעונאות פיזית": 4,
    "B2B שירותים": 8,
    "מוצרי צריכה (FMCG)": 18,
    "מזון ומשקאות": 10,
    "שירותים פיננסיים": 12,
    "בריאות ופארמה": 10,
    "נדל\"ן": 4,
    "חינוך": 5,
    "תיירות ואירוח": 8,
    "רכב": 6
  };

  return industryMap[industry] || null;
}

/**
 * מקבל מכפיל לפי אזור פעילות
 * @param {string} area - אזור הפעילות
 * @returns {number} מכפיל לפי אזור
 */
function getAreaMultiplier(area) {
  return areaMultipliers[area] || 1.0;
}

/**
 * מקבל מכפיל לפי גודל קהל יעד
 * @param {string} size - גודל קהל היעד
 * @returns {number} מכפיל לפי גודל קהל
 */
function getAudienceSizeMultiplier(size) {
  return audienceSizeMultipliers[size] || 1.0;
} 