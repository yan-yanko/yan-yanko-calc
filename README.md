# מחשבון הקצאת תקציב שיווק - מותג מול פרפורמנס

מחשבון אינטראקטיבי המסייע לעסקים לקבל החלטות מושכלות לגבי חלוקת תקציב השיווק בין פעילות מותג לפעילות פרפורמנס.

## תכונות עיקריות

- חישוב תקציב שיווק שנתי מומלץ לפי תחום העסק
- התאמה אישית של אחוז התקציב
- הגדרת פרמטרים עסקיים שונים המשפיעים על ההמלצה
- המלצת חלוקה בין מותג לפרפורמנס
- אפשרות להתאמה אישית של החלוקה
- ויזואליזציה של התוצאות באמצעות תרשים עוגה

## טכנולוגיות

- React
- TypeScript
- Tailwind CSS
- Recharts

## התקנה

1. התקן את התלויות:
```bash
npm install
```

2. הפעל את הפרויקט בסביבת פיתוח:
```bash
npm start
```

3. בנה את הפרויקט לייצור:
```bash
npm run build
```

## מבנה הפרויקט

```
src/
  ├── components/          # קומפוננטות React
  │   ├── BrandPerformanceCalculator.js
  │   ├── Step1.js
  │   ├── Step2.js
  │   ├── Step3.js
  │   └── BudgetPieChart.js
  ├── data/               # נתונים סטטיים
  │   ├── recommendationsData.js
  │   └── marketingPercentages.js
  ├── hooks/              # הוקים מותאמים אישית
  │   ├── useBudgetCalculation.js
  │   └── useRecommendationCalculation.js
  └── styles/             # קבצי סגנון
      └── calculator.css
```

## מקורות הנתונים

ההמלצות מבוססות על מחקרים מתוך:
- Effectiveness in Context
- Media in Focus

## רישיון

MIT 