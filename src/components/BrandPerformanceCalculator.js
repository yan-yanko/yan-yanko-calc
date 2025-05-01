import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { buildExplanation } from '../utils/buildExplanation';
import { getBusinessProfile } from '../utils/getBusinessProfile';
import { calculateFinalRecommendation } from '../utils/calculateRecommendation';
import BrandPerformanceResult from './BrandPerformanceResult';
import Step1 from './Step1';

const BrandPerformanceCalculator = () => {
  // מצב פנימי של הקומפוננטה - כל useState בראש!
  const [currentStep, setCurrentStep] = useState(1);
  const [annualRevenue, setAnnualRevenue] = useState(1000000);
  const [industry, setIndustry] = useState("");
  const [marketingBudget, setMarketingBudget] = useState(100000);
  const [customBudgetPercent, setCustomBudgetPercent] = useState(false);
  const [customBudgetValue, setCustomBudgetValue] = useState(10);
  const [audienceSize, setAudienceSize] = useState("");
  const [selections, setSelections] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [finalRecommendation, setFinalRecommendation] = useState({ brand: 60, performance: 40 });
  const [brandBudget, setBrandBudget] = useState(60000);
  const [perfBudget, setPerfBudget] = useState(40000);
  const [customAllocation, setCustomAllocation] = useState(false);
  const [customAllocationValue, setCustomAllocationValue] = useState(60);
  const [recommendationExplanation, setRecommendationExplanation] = useState("");
  const [businessProfile, setBusinessProfile] = useState(null);
  const [errors, setErrors] = useState({
    step1: '',
    step2: ''
  });
  
  // הנתונים מהקובץ
  const recommendationsData = [
    {
      dimension: "שלב חיים של המותג",
      context: "מותג חדש",
      brand: 35,
      performance: 65,
      source: "Effectiveness in Context"
    },
    {
      dimension: "שלב חיים של המותג",
      context: "בתחילת הצמיחה",
      brand: 57,
      performance: 43,
      source: "Effectiveness in Context"
    },
    {
      dimension: "שלב חיים של המותג",
      context: "מותג בינוני",
      brand: 62,
      performance: 38,
      source: "Effectiveness in Context"
    },
    {
      dimension: "שלב חיים של המותג",
      context: "מותג מוביל",
      brand: 72,
      performance: 28,
      source: "Effectiveness in Context"
    },
    {
      dimension: "חדשנות",
      context: "מוצר/שירות חדש לחלוטין",
      brand: 75,
      performance: 25,
      source: "Effectiveness in Context"
    },
    {
      dimension: "חדשנות",
      context: "השקה של וריאנט חדש",
      brand: 60,
      performance: 40,
      source: "Effectiveness in Context"
    },
    {
      dimension: "חדשנות",
      context: "השקה של תת-מותג חדש",
      brand: 65,
      performance: 35,
      source: "Effectiveness in Context"
    },
    {
      dimension: "חדשנות",
      context: "התרחבות לקטגוריה חדשה",
      brand: 70,
      performance: 30,
      source: "Effectiveness in Context"
    },
    {
      dimension: "חדשנות",
      context: "ללא חדשנות – אותו מוצר, אותה קטגוריה",
      brand: 55,
      performance: 45,
      source: "Effectiveness in Context"
    },
    {
      dimension: "שלב חיים של הקטגוריה",
      context: "קטגוריה חדשה",
      brand: 70,
      performance: 30,
      source: "Effectiveness in Context"
    },
    {
      dimension: "שלב חיים של הקטגוריה",
      context: "קטגוריה מבוססת בצמיחה",
      brand: 60,
      performance: 40,
      source: "Effectiveness in Context"
    },
    {
      dimension: "שלב חיים של הקטגוריה",
      context: "קטגוריה מבוססת בצמיחה איטית או קיפאון",
      brand: 58,
      performance: 42,
      source: "Effectiveness in Context"
    },
    {
      dimension: "שלב חיים של הקטגוריה",
      context: "קטגוריה בירידה",
      brand: 55,
      performance: 45,
      source: "Effectiveness in Context"
    },
    {
      dimension: "זמן רכישה",
      context: "מיידי עד כמה שעות",
      brand: 50,
      performance: 50,
      source: "Effectiveness in Context"
    },
    {
      dimension: "זמן רכישה",
      context: "כמה ימים עד כמה שבועות",
      brand: 55,
      performance: 45,
      source: "Effectiveness in Context"
    },
    {
      dimension: "זמן רכישה",
      context: "חודש עד שלושה חודשים",
      brand: 65,
      performance: 35,
      source: "Effectiveness in Context"
    },
    {
      dimension: "זמן רכישה",
      context: "שלושה חודשים ומעלה",
      brand: 75,
      performance: 25,
      source: "Effectiveness in Context"
    },
    {
      dimension: "ערוץ מכירה",
      context: "אונליין בלבד",
      brand: 55,
      performance: 45,
      source: "Effectiveness in Context"
    },
    {
      dimension: "ערוץ מכירה",
      context: "אופליין בלבד",
      brand: 60,
      performance: 40,
      source: "Effectiveness in Context"
    },
    {
      dimension: "ערוץ מכירה",
      context: "גם אונליין וגם אופליין",
      brand: 60,
      performance: 40,
      source: "Effectiveness in Context"
    },
    {
      dimension: "תמחור",
      context: "נמוך מהקטגוריה",
      brand: 55,
      performance: 45,
      source: "Effectiveness in Context"
    },
    {
      dimension: "תמחור",
      context: "ממוצע לקטגוריה",
      brand: 60,
      performance: 40,
      source: "Effectiveness in Context"
    },
    {
      dimension: "תמחור",
      context: "גבוה מהקטגוריה",
      brand: 70,
      performance: 30,
      source: "Effectiveness in Context"
    },
    {
      dimension: "קטגוריה",
      context: "מוצרי צריכה (FMCG)",
      brand: 70,
      performance: 30,
      source: "Effectiveness in Context"
    },
    {
      dimension: "קטגוריה",
      context: "שירותים פיננסיים",
      brand: 65,
      performance: 35,
      source: "Effectiveness in Context"
    },
    {
      dimension: "קטגוריה",
      context: "SaaS / טכנולוגיה",
      brand: 55,
      performance: 45,
      source: "Effectiveness in Context"
    },
    {
      dimension: "קטגוריה",
      context: "נסיעות / שירותים מתכלים",
      brand: 50,
      performance: 50,
      source: "Effectiveness in Context"
    },
    {
      dimension: "קטגוריה",
      context: "קמעונאות",
      brand: 60,
      performance: 40,
      source: "Effectiveness in Context"
    },
    {
      dimension: "קטגוריה",
      context: "מזון ומשקאות",
      brand: 65,
      performance: 35,
      source: "Effectiveness in Context"
    }
  ];

  // מידע על אחוזי שיווק ממכירות לפי תעשייה
  const marketingPercentages = [
    { industry: "חברות תוכנה / SaaS / טכנולוגיה", percentage: 15, note: "אחוז גבוה בשל צורך בחינוך שוק ותחרות" },
    { industry: "קמעונאות אונליין", percentage: 10, note: "דגש על פרפורמנס ורכישת לקוחות" },
    { industry: "קמעונאות פיזית", percentage: 4, note: "שילוב אונליין ופיזי" },
    { industry: "B2B שירותים", percentage: 8, note: "דגש על יצירת לידים וטיפוח מערכות יחסים" },
    { industry: "מוצרי צריכה (FMCG)", percentage: 18, note: "השקעה גבוהה בבניית מותג ומודעות" },
    { industry: "מזון ומשקאות", percentage: 10, note: "בניית מותג וגם קידום מכירות מקומי" },
    { industry: "שירותים פיננסיים", percentage: 12, note: "השקעה באמון ובמוניטין" },
    { industry: "בריאות ופארמה", percentage: 10, note: "השקעה בבניית אמון" },
    { industry: "נדל\"ן", percentage: 4, note: "השקעה ממוקדת לפי פרויקטים" },
    { industry: "חינוך", percentage: 5, note: "השקעה במודעות וגיוס תלמידים" },
    { industry: "תיירות ואירוח", percentage: 8, note: "דגש על עונתיות ומבצעים" },
    { industry: "רכב", percentage: 6, note: "בניית מותג וקידום דגמים חדשים" },
    { industry: "ביגוד ואופנה", percentage: 12, note: "השקעה גבוהה בבניית מותג" },
    { industry: "מוצרי יוקרה", percentage: 14, note: "השקעה גבוהה בבניית ערך מותג" },
    { industry: "שירותים מקצועיים", percentage: 5, note: "דגש על מוניטין וקשרים" },
    { industry: "סטארטאפ / מוצר חדש", percentage: 20, note: "השקעה גבוהה בחדירה לשוק" },
    { industry: "עסק קטן מקומי", percentage: 7, note: "שיווק מקומי וממוקד" },
    { industry: "אחר", percentage: 10, note: "בסיס כללי לתעשיות אחרות" }
  ];

  // משקולות לכל ממד
  const dimensionWeights = {
    "שלב חיים של המותג": 1.5,
    "חדשנות": 1.3,
    "שלב חיים של הקטגוריה": 1.2,
    "זמן רכישה": 1.2,
    "ערוץ מכירה": 0.8,
    "תמחור": 0.7
  };

  // הוספת אובייקט הממפה בין תצוגה לערך
  const categoryDisplayMap = {
    "מוצרי צריכה (FMCG)": "מוצרי צריכה",
    "שירותים": "שירותים",
    "SaaS / טכנולוגיה": "SaaS וטכנולוגיה",
    "פיננסים": "פיננסים",
    "קמעונאות (Retail)": "קמעונאות",
    "שירותים בני חלוף (Travel)": "שירותים בני חלוף"
  };

  // עדכון תעשייה
  useEffect(() => {
    if (industry) {
      // מצא את הקטגוריה המתאימה לתעשייה
      let category = "";
      if (industry.includes("מוצרי צריכה") || industry.includes("FMCG")) {
        category = "מוצרי צריכה (FMCG)";
      } else if (industry.includes("שירותים פיננסיים")) {
        category = "פיננסים";
      } else if (industry.includes("SaaS") || industry.includes("טכנולוגיה")) {
        category = "SaaS / טכנולוגיה";
      } else if (industry.includes("נסיעות") || industry.includes("שירותים מתכלים")) {
        category = "שירותים בני חלוף (Travel)";
      } else if (industry.includes("קמעונאות")) {
        category = "קמעונאות (Retail)";
      } else if (industry.includes("מזון") || industry.includes("משקאות")) {
        category = "מוצרי צריכה (FMCG)";
      } else {
        category = "שירותים"; // ברירת מחדל
      }
      
      // עדכן את הבחירה בקטגוריה
      handleDimensionChange("קטגוריה", category);
      setSelections(prev => ({ ...prev, "קטגוריה": category }));
    }
  }, [industry]);

  // ארגון הנתונים לפי ממדים
  const getDimensionsAndOptions = () => {
    const dimensions = {};
    recommendationsData.forEach(item => {
      // רק אם הממד הוא אחד מששת הממדים שאנחנו רוצים להציג בשלב 2
      if (["שלב חיים של המותג", "חדשנות", "שלב חיים של הקטגוריה", 
           "ערוץ מכירה", "תמחור", "זמן רכישה"].includes(item.dimension)) {
        if (!dimensions[item.dimension]) {
          dimensions[item.dimension] = [];
        }
        // בדיקה שהאפשרות לא קיימת כבר במערך
        if (!dimensions[item.dimension].includes(item.context)) {
          dimensions[item.dimension].push(item.context);
        }
      }
    });
    return dimensions;
  };

  const dimensionsMap = getDimensionsAndOptions();
  const dimensionsList = Object.keys(dimensionsMap);
  
  // צבעים לתרשים
  const COLORS = ['#8884d8', '#82ca9d'];
  
  // עדכון תקציב שיווק לפי מחזור המכירות והתעשייה
  useEffect(() => {
    if (!customBudgetPercent) {
      const selectedIndustryInfo = marketingPercentages.find(item => item.industry === industry);
      if (selectedIndustryInfo) {
        const recommendedBudget = Math.round(annualRevenue * (selectedIndustryInfo.percentage / 100));
        setMarketingBudget(recommendedBudget);
        setCustomBudgetValue(selectedIndustryInfo.percentage);
      }
    }
  }, [industry, annualRevenue, customBudgetPercent]);
  
  // עדכון תקציב שיווק מותאם אישית
  useEffect(() => {
    if (customBudgetPercent) {
      const calculatedBudget = Math.round(annualRevenue * (customBudgetValue / 100));
      setMarketingBudget(calculatedBudget);
    }
  }, [customBudgetValue, annualRevenue, customBudgetPercent]);
  
  // עדכון זמן קבלת החלטה
  const decisionTimeOptions = [
    { context: "מיידי עד כמה שעות", brand: 50, performance: 50 },
    { context: "כמה ימים עד כמה שבועות", brand: 55, performance: 45 },
    { context: "חודש עד שלושה חודשים", brand: 65, performance: 35 },
    { context: "שלושה חודשים ומעלה", brand: 75, performance: 25 }
  ];
  
  // עדכון ערוץ מכירה
  const salesChannels = [
    { context: "אונליין בלבד", brand: 55, performance: 45 },
    { context: "אופליין בלבד", brand: 60, performance: 40 },
    { context: "גם אונליין וגם אופליין", brand: 60, performance: 40 }
  ];
  
  // עדכון תמחור
  const pricingOptions = [
    { context: "נמוך מהקטגוריה", brand: 55, performance: 45 },
    { context: "ממוצע לקטגוריה", brand: 60, performance: 40 },
    { context: "גבוה מהקטגוריה", brand: 70, performance: 30 }
  ];
  
  // עדכון תעשייה
  useEffect(() => {
    if (!customBudgetPercent) {
      const selectedIndustryInfo = marketingPercentages.find(item => item.industry === industry);
      if (selectedIndustryInfo) {
        const recommendedBudget = Math.round(annualRevenue * (selectedIndustryInfo.percentage / 100));
        setMarketingBudget(recommendedBudget);
        setCustomBudgetValue(selectedIndustryInfo.percentage);
      }
    }
  }, [industry, annualRevenue, customBudgetPercent]);
  
  // עדכון בחירות המשתמש לגבי ממדי העסק
  const handleDimensionChange = (dimension, value) => {
    const newValues = { ...selectedValues, [dimension]: value };
    setSelectedValues(newValues);
    
    const newRecommendation = calculateFinalRecommendation(newValues);
    if (newRecommendation) {
      setFinalRecommendation(newRecommendation);
    }
  };
  
  // עדכון מחזור מכירות שנתי
  const handleRevenueChange = (e) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
    setAnnualRevenue(value);
  };
  
  // עדכון תקציב שיווק מותאם אישית
  const handleCustomBudgetChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setCustomBudgetValue(Math.min(Math.max(value, 1), 50));
  };
  
  // עדכון הקצאה מותאמת אישית בין מותג לפרפורמנס
  const handleCustomAllocationChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setCustomAllocationValue(Math.min(Math.max(value, 0), 100));
  };
  
  // פונקציה לקביעת גבולות הקצאת המותג לפי פרופיל העסק
  function getBrandAllocationLimits(selectedValues) {
    let minBrand = 30;
    let maxBrand = 80;

    // בדיקת שלב חיים של המותג
    const isNewBrand = selectedValues["שלב חיים של המותג"]?.context === "מותג חדש";
    const isMatureBrand = selectedValues["שלב חיים של המותג"]?.context === "מותג בוגר";

    // בדיקת זמן קבלת החלטה
    const isLongDecisionTime = selectedValues["זמן רכישה"]?.context === "שלושה חודשים ומעלה";
    const isShortDecisionTime = selectedValues["זמן רכישה"]?.context === "מיידי עד כמה שעות";

    // בדיקת גודל המותג
    const isLargeBrand = selectedValues["גודל המותג"]?.context === "מותג גדול";
    const isSmallBrand = selectedValues["גודל המותג"]?.context === "מותג קטן";

    // מותג חדש? העלאת המינימום להשקעה במותג
    if (isNewBrand) minBrand = Math.max(minBrand, 50);

    // מותג בוגר? הורדת המינימום להשקעה במותג
    if (isMatureBrand) minBrand = Math.min(minBrand, 40);

    // זמן החלטה ארוך? הגדלת הטווח המותר
    if (isLongDecisionTime) maxBrand = 90;

    // זמן החלטה קצר? הקטנת הטווח המותר
    if (isShortDecisionTime) maxBrand = 70;

    // מותג גדול? העלאת המינימום להשקעה במותג
    if (isLargeBrand) minBrand = Math.max(minBrand, 45);

    // מותג קטן? הורדת המינימום להשקעה במותג
    if (isSmallBrand) minBrand = Math.min(minBrand, 35);

    return { minBrand, maxBrand };
  }

  // עדכון תקציבים על פי האחוזים
  useEffect(() => {
    const brandAmount = Math.round((finalRecommendation.brand / 100) * marketingBudget);
    setBrandBudget(brandAmount);
    setPerfBudget(marketingBudget - brandAmount);
  }, [finalRecommendation, marketingBudget]);
  
  // עדכון תרשים עוגה
  const getPieData = () => [
    { name: 'מותג', value: finalRecommendation.brand },
    { name: 'פרפורמנס', value: finalRecommendation.performance }
  ];

  const getIndustryRecommendation = () => {
    const selected = marketingPercentages.find(item => item.industry === industry);
    return selected ? selected : { percentage: 10, note: "ממוצע כללי למגוון תעשיות" };
  };
  
  // עדכון עדכון בחירת ערוץ מכירה
  const handleSalesChannelChange = (e) => {
    const selectedOption = salesChannels.find(option => option.context === e.target.value);
    if (selectedOption) {
      handleDimensionChange("ערוץ מכירה", selectedOption.context);
    }
  };
  
  // עדכון בחירת תמחור
  const handlePricingChange = (e) => {
    const value = e.target.value;
    handleDimensionChange("תמחור", value);
  };
  
  // עדכון בחירת זמן קבלת החלטה
  const handleDecisionTimeChange = (e) => {
    const selectedOption = decisionTimeOptions.find(option => option.context === e.target.value);
    if (selectedOption) {
      handleDimensionChange("זמן רכישה", selectedOption.context);
    }
  };
  
  // עדכון ההסבר בכל פעם שההמלצה משתנה
  useEffect(() => {
    if (Object.keys(selectedValues).length > 0) {
      const explanation = buildExplanation(selectedValues);
      setRecommendationExplanation(explanation);
    }
  }, [selectedValues]);
  
  // עדכון פרופיל העסק בכל פעם שהבחירות משתנות
  useEffect(() => {
    if (Object.keys(selectedValues).length > 0) {
      const profile = getBusinessProfile(selectedValues);
      setBusinessProfile(profile);
    }
  }, [selectedValues]);
  
  const validateStep1 = () => {
    if (!industry) {
      setErrors(prev => ({ ...prev, step1: 'יש לבחור תחום עסקי' }));
      return false;
    }
    if (!annualRevenue) {
      setErrors(prev => ({ ...prev, step1: 'יש להזין הכנסה שנתית' }));
      return false;
    }
    setErrors(prev => ({ ...prev, step1: '' }));
    return true;
  };

  const validateStep2 = () => {
    const requiredDimensions = [
      "שלב חיים של המותג",
      "חדשנות",
      "שלב חיים של הקטגוריה",
      "ערוץ מכירה",
      "תמחור",
      "זמן רכישה"
    ];
    const missingDimensions = requiredDimensions.filter(dim => !selectedValues[dim]);
    
    if (missingDimensions.length > 0) {
      setErrors(prev => ({
        ...prev,
        step2: `יש לבחור את כל השדות הנדרשים: ${missingDimensions.join(", ")}`
      }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, step2: "" }));
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setIndustry('');
    setAnnualRevenue(1000000);
    setSelectedValues({});
    setMarketingBudget(100000);
    setFinalRecommendation({ brand: 50, performance: 50 });
    setBusinessProfile(null);
    setErrors({ step1: '', step2: '' });
  };
  
  // עדכון פונקציית handleSelectionChange
  const handleSelectionChange = (dimension, value) => {
    console.log("selections:", selections);
    // אם זה קטגוריה, נשמור את הערך המדויק
    if (dimension === "קטגוריה") {
      const exactValue = Object.keys(categoryDisplayMap).find(key => key === value);
      setSelections(prev => ({
        ...prev,
        [dimension]: exactValue || value
      }));
    } else {
      setSelections(prev => ({
        ...prev,
        [dimension]: value
      }));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">מחשבון הקצאת תקציב שיווק - מותג מול פרפורמנס</h2>
      
      <div className="mb-8 bg-blue-50 p-6 rounded-lg shadow">
        <p className="mb-3 font-semibold text-lg">מדריך 3 שלבים לתכנון תקציב השיווק שלך:</p>
        <ol className="list-decimal list-inside text-base">
          <li className={currentStep === 1 ? "font-bold text-blue-700" : ""}>חישוב תקציב השיווק השנתי המומלץ</li>
          <li className={currentStep === 2 ? "font-bold text-blue-700" : ""}>הגדרת פרמטרים עסקיים</li>
          <li className={currentStep === 3 ? "font-bold text-blue-700" : ""}>קבלת המלצת חלוקה בין מותג לפרפורמנס</li>
        </ol>
      </div>
      
      {/* שלב 1: חישוב תקציב שיווק שנתי */}
      {currentStep === 1 && (
        <Step1
          industry={industry}
          setIndustry={setIndustry}
          annualRevenue={annualRevenue}
          setAnnualRevenue={setAnnualRevenue}
          audienceSize={audienceSize}
          setAudienceSize={setAudienceSize}
          customBudgetPercent={customBudgetPercent}
          setCustomBudgetPercent={setCustomBudgetPercent}
          customBudgetValue={customBudgetValue}
          setCustomBudgetValue={setCustomBudgetValue}
          onNext={() => nextStep()}
          validate={validateStep1}
          marketingBudget={marketingBudget}
        />
      )}
      
      {/* שלב 2: הגדרת פרמטרים עסקיים */}
      {currentStep === 2 && (
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <p className="text-lg">
              עכשיו שאנחנו יודעים שאתם מכוונים ל-{annualRevenue.toLocaleString()} ₪,{' '}
              העסק שלכם בתחום {industry} עם תקציב שיווק {marketingBudget !== null ? `${marketingBudget.toLocaleString()} ₪` : 'לא מחושב'},
              בואו נבין כיצד לחלק את התקציב
            </p>
          </div>

          <h3 className="text-xl font-bold mb-6">שלב 2: הגדרת פרמטרים עסקיים</h3>
          
          <div className="space-y-6">
            {Object.entries(dimensionsMap)
              .filter(([dimension]) => dimension !== "גודל המותג" && dimension !== "מודל רכישה")
              .map(([dimension, options]) => (
                <div key={dimension} className="mb-6">
                  <label className="block mb-3 font-semibold text-lg">{dimension}: <span className="text-red-500">*</span></label>
                  <select 
                    value={selectedValues[dimension] || ""} 
                    onChange={(e) => handleDimensionChange(dimension, e.target.value)}
                    className={`p-3 border ${errors.step2 && !selectedValues[dimension] ? 'border-red-500' : 'border-gray-300'} rounded w-full text-lg`}
                  >
                    <option value="">בחר {dimension}</option>
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
          </div>

          {errors.step2 && (
            <div className="text-red-500 text-base mb-6">
              {errors.step2}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded text-lg font-semibold hover:bg-gray-300"
            >
              חזור
            </button>
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-blue-600 text-white rounded text-lg font-semibold hover:bg-blue-700"
            >
              המשך
            </button>
          </div>
        </div>
      )}
      
      {/* שלב 3: המלצת חלוקה */}
      {currentStep === 3 && (
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-6">המלצת חלוקת תקציב</h3>
          <BrandPerformanceResult 
            finalRecommendation={finalRecommendation}
            selections={selectedValues}
            profile={businessProfile}
          />
          
          <div className="mt-8 text-base text-gray-600 border-t pt-6">
            <p>* ההמלצה מבוססת על מחקרים מתוך Effectiveness in Context ו-Media in Focus.</p>
            <p>* התוצאה מחושבת כממוצע של ההמלצות עבור כל הפרמטרים שנבחרו.</p>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={resetCalculator}
              className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              התחל מהתחלה
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandPerformanceCalculator; 