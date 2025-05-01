import React, { useEffect } from 'react';
import { baseCategorySplits } from '../utils/calculateRecommendation';

const Step2 = ({ industry, selections, handleSelectionChange, annualRevenue, marketingBudget }) => {
  // מציאת הקטגוריה המתאימה לתעשייה
  const findMatchingCategory = (industry) => {
    if (industry.includes("מוצרי צריכה") || industry.includes("FMCG")) {
      return "מוצרי צריכה (FMCG)";
    } else if (industry.includes("שירותים פיננסיים")) {
      return "פיננסים";
    } else if (industry.includes("SaaS") || industry.includes("טכנולוגיה")) {
      return "SaaS / טכנולוגיה";
    } else if (industry.includes("נסיעות") || industry.includes("שירותים מתכלים")) {
      return "שירותים בני חלוף (Travel)";
    } else if (industry.includes("קמעונאות")) {
      return "קמעונאות (Retail)";
    } else if (industry.includes("מזון") || industry.includes("משקאות")) {
      return "מוצרי צריכה (FMCG)";
    } else {
      return "שירותים"; // ברירת מחדל
    }
  };

  // מציאת ההמלצה הגנרית
  const getGenericRecommendation = () => {
    if (!industry) return null;
    
    const category = findMatchingCategory(industry);
    const recommendation = baseCategorySplits[category] || { brand: 60, performance: 40 };
    
    return recommendation;
  };

  const genericRecommendation = getGenericRecommendation();
  // ערך בטוח ל-marketingBudget
  const safeMarketingBudget = marketingBudget ?? 0;

  useEffect(() => {
    console.log("Step2 loaded with:", { industry, genericRecommendation });
  }, []);

  return (
    <div className="space-y-6">
      {/* תיבת מידע עם המלצה גנרית */}
      {genericRecommendation && (
        <div className="bg-[#EFF6FF] p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4 text-[#1E40AF]">📊 <strong>המלצה גנרית לתחום שבחרת:</strong></h3>
          <p className="mb-4 text-[#1E40AF]">
            בהתבסס על תחום העסק שבחרת ({industry}), המלצת החלוקה הראשונית של לס בינט ופיטר פילד היא:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#1E40AF] mb-4">
            <li>{genericRecommendation.brand}% מותג</li>
            <li>{genericRecommendation.performance}% פרפורמנס</li>
          </ul>
          <p className="text-[#1E40AF]">
            💡 מחזור המכירות שלך הוא: {annualRevenue.toLocaleString()} ₪
          </p>
          <p className="text-[#1E40AF]">
            בהתאם למחזור הזה, תקציב השיווק שחישבנו עבורך הוא: {
              marketingBudget !== null 
                ? `${safeMarketingBudget.toLocaleString()} ₪` 
                : 'לא ניתן לחשב'
            }
          </p>
        </div>
      )}

      {/* שאר הטופס */}
      <div className="space-y-6">
        {/* ... קוד קיים ... */}
      </div>
    </div>
  );
};

export default Step2; 