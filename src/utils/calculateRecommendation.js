export const baseCategorySplits = {
  "מוצרי צריכה (FMCG)": { brand: 70, performance: 30 },
  "שירותים": { brand: 60, performance: 40 },
  "SaaS / טכנולוגיה": { brand: 55, performance: 45 },
  "פיננסים": { brand: 69, performance: 31 },
  "קמעונאות (Retail)": { brand: 64, performance: 36 },
  "שירותים בני חלוף (Travel)": { brand: 55, performance: 45 }
};

export const offsets = {
  "שלב חיים של המותג": {
    "מותג חדש": -25,
    "בתחילת הצמיחה": -3,
    "מותג בינוני": +2,
    "מותג מוביל": +12
  },
  "חדשנות": {
    "מוצר/שירות חדש לחלוטין": +15,
    "השקה של וריאנט חדש": 0,
    "השקה של תת-מותג חדש": +5,
    "התרחבות לקטגוריה חדשה": +10,
    "ללא חדשנות – אותו מוצר": -5
  },
  "שלב חיים של הקטגוריה": {
    "קטגוריה חדשה": +10,
    "קטגוריה בצמיחה": 0,
    "קטגוריה בצמיחה איטית או קיפאון": -2,
    "קטגוריה בירידה": -5
  },
  "ערוץ מכירה": {
    "אונליין בלבד": -5,
    "אופליין בלבד": 0,
    "גם אונליין וגם אופליין": 0
  },
  "תמחור": {
    "נמוך מהקטגוריה": -5,
    "ממוצע לקטגוריה": 0,
    "גבוה מהקטגוריה": +10
  },
  "זמן רכישה": {
    "מיידי עד כמה שעות": -10,
    "כמה ימים עד כמה שבועות": -5,
    "חודש עד שלושה חודשים": +5,
    "שלושה חודשים ומעלה": +15
  }
};

export const calculateFinalRecommendation = (values) => {
  // שלב 1: קביעת נקודת מוצא לפי הקטגוריה
  const category = values["קטגוריה"];
  const base = baseCategorySplits[category] || { brand: 60, performance: 40 };

  let totalOffset = 0;

  // שלב 2: החלת ה-offsets על פי שאר הבחירות
  Object.entries(values).forEach(([dimension, value]) => {
    if (offsets[dimension] && offsets[dimension][value] !== undefined) {
      totalOffset += offsets[dimension][value];
    }
  });

  // שלב 3: חישוב החלוקה הסופית עם סף מינימלי של 40% למותג
  let finalBrand = Math.max(40, Math.min(100, base.brand + totalOffset));
  let finalPerformance = 100 - finalBrand;

  return {
    brand: finalBrand,
    performance: finalPerformance
  };
}; 