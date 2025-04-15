import { businessProfiles } from "../data/businessProfiles";

export function getBusinessProfile(selectedValues) {
  // המרת הבחירות למבנה המתאים
  const profileValues = {
    brandFamiliarity: selectedValues["שלב חיים של המותג"]?.context === "מותג חדש" ? "new" : "known",
    salesCycle: selectedValues["זמן קבלת החלטה"]?.context === "שלושה חודשים ומעלה" ? "long" : "short",
    highConsideration: selectedValues["תמחור"]?.context === "Premium (פרימיום)" ? "yes" : "no",
    emotionalDecision: selectedValues["ערוץ מכירה"]?.context === "אופליין בלבד" ? "yes" : "no"
  };

  // בדיקת התאמה לכל פרופיל
  for (const profile of businessProfiles) {
    const { conditions } = profile;
    if (conditions === "mixed") continue;

    const matchesAll = Object.entries(conditions).every(([key, value]) => {
      return profileValues[key] === value;
    });

    if (matchesAll) return profile;
  }

  // החזרת פרופיל ברירת מחדל אם אין התאמה
  return businessProfiles.find((p) => p.conditions === "mixed");
} 