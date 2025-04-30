import { calculateFinalRecommendation } from "./calculateRecommendation";
import { baseCategorySplits, offsets } from "./calculateRecommendation";
import { explanationSnippets } from "../data/explanationSnippets";

// הוספת אובייקט הממפה בין תצוגה לערך
const categoryDisplayMap = {
  "מוצרי צריכה (FMCG)": "מוצרי צריכה",
  "שירותים": "שירותים",
  "SaaS / טכנולוגיה": "SaaS וטכנולוגיה",
  "פיננסים": "פיננסים",
  "קמעונאות (Retail)": "קמעונאות",
  "שירותים בני חלוף (Travel)": "שירותים בני חלוף"
};

export function buildExplanation(selectedValues) {
  const explanations = [];

  // שלב 1: תיאור נקודת המוצא
  const category = selectedValues["קטגוריה"];
  console.log('category:', category);
  console.log('baseCategorySplits keys:', Object.keys(baseCategorySplits));
  if (category && !Object.keys(baseCategorySplits).includes(category)) {
    console.warn(`הערך ב-category לא תואם לאף מפתח ב-baseCategorySplits:`, category);
  }

  function findMatchingCategory(category) {
    return Object.keys(baseCategorySplits).find(key => key.includes(category));
  }

  // מציאת הקטגוריה המתאימה
  const matchedCategory = findMatchingCategory(category);
  const base = matchedCategory ? baseCategorySplits[matchedCategory] : { brand: 60, performance: 40 };
  
  // הוספת הסבר על הקטגוריה
  if (matchedCategory) {
    const displayCategory = categoryDisplayMap[matchedCategory] || matchedCategory;
    explanations.push(`נקודת המוצא לפי קטגוריה ${displayCategory}: ${base.brand}% מותג, ${base.performance}% פרפורמנס.`);
  } else {
    explanations.push(`לא נמצאה קטגוריה תואמת, השתמשנו בברירת מחדל: ${base.brand}% מותג, ${base.performance}% פרפורמנס.`);
  }

  console.log('Category:', category, 'Matched Category:', matchedCategory);

  // שלב 2: תיאור ההשפעות של כל פרמטר
  Object.entries(selectedValues).forEach(([dimension, value]) => {
    if (dimension === "קטגוריה") return;
    // offset
    if (offsets[dimension] && offsets[dimension][value] !== undefined && offsets[dimension][value] !== 0) {
      const offset = offsets[dimension][value];
      const sign = offset > 0 ? "הוסיפה" : "הפחיתה";
      explanations.push(`הבחירה ב-'${value}' ${sign} ${Math.abs(offset)} נקודות מהמותג.`);
    }
    // snippet
    if (
      explanationSnippets[dimension] &&
      explanationSnippets[dimension][value]
    ) {
      explanations.push(explanationSnippets[dimension][value]);
    }
  });

  // שלב 3: חישוב ההמלצה הסופית
  const recommendation = calculateFinalRecommendation(selectedValues);
  explanations.push(`לאחר כל ההתאמות, התקבלה המלצה של ${recommendation.brand}% מותג ו-${recommendation.performance}% פרפורמנס.`);

  // שלב 4: סיכום כללי (כמו שהיה)
  if (recommendation.brand > 70) {
    explanations.push("לכן, ההמלצה היא להשקיע משמעותית בבניית המותג.");
  } else if (recommendation.brand < 40) {
    explanations.push("לכן, ההמלצה היא להתמקד בתוצאות מיידיות דרך פרפורמנס.");
  } else {
    explanations.push("לכן, ההמלצה היא לאזן בין בניית מותג להשגת תוצאות מיידיות.");
  }

  return explanations.join(" ");
} 