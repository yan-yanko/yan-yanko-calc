import { explanationSnippets } from "../data/explanationSnippets";

export function buildExplanation(selectedValues) {
  const explanations = [];
  
  // מעבר על כל הבחירות שנבחרו
  for (const [dimension, value] of Object.entries(selectedValues)) {
    if (explanationSnippets[dimension] && explanationSnippets[dimension][value]) {
      explanations.push(explanationSnippets[dimension][value]);
    }
  }
  
  // הוספת סיכום כללי
  if (explanations.length > 0) {
    const brandPercentage = selectedValues.brand || 60;
    if (brandPercentage > 70) {
      explanations.push("לכן, ההמלצה היא להשקיע משמעותית בבניית המותג.");
    } else if (brandPercentage < 40) {
      explanations.push("לכן, ההמלצה היא להתמקד בתוצאות מיידיות דרך פרפורמנס.");
    } else {
      explanations.push("לכן, ההמלצה היא לאזן בין בניית מותג להשגת תוצאות מיידיות.");
    }
  }
  
  return explanations.join(" ");
} 