import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { useBudgetCalculation } from '../hooks/useBudgetCalculation';
import { useRecommendationCalculation } from '../hooks/useRecommendationCalculation';
import { recommendationsData } from '../data/recommendationsData';

const BrandPerformanceCalculator = () => {
  // מצב פנימי של הקומפוננטה
  const [currentStep, setCurrentStep] = useState(1);
  const [annualRevenue, setAnnualRevenue] = useState(1000000);
  const [industry, setIndustry] = useState("");
  const [customBudgetPercent, setCustomBudgetPercent] = useState(false);
  const [customBudgetValue, setCustomBudgetValue] = useState(10);
  const [selections, setSelections] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [customAllocation, setCustomAllocation] = useState(false);
  const [customAllocationValue, setCustomAllocationValue] = useState(60);

  // חישוב תקציב שיווק
  const marketingBudget = useBudgetCalculation(
    annualRevenue,
    industry,
    customBudgetPercent,
    customBudgetValue
  );

  // חישוב המלצות
  const finalRecommendation = useRecommendationCalculation(
    selectedValues,
    customAllocation,
    customAllocationValue
  );

  // חישוב תקציבים לפי האחוזים
  const brandBudget = Math.round((finalRecommendation.brand / 100) * marketingBudget);
  const perfBudget = marketingBudget - brandBudget;

  // עדכון בחירות המשתמש לגבי ממדי העסק
  const handleSelectionChange = (dimension, value) => {
    const newSelections = { ...selections };
    
    if (value === "") {
      delete newSelections[dimension];
    } else {
      newSelections[dimension] = value;
      
      // מצא את ערך ה-brand וה-performance המתאימים
      const selectedOption = recommendationsData.find(
        item => item.dimension === dimension && item.context === value
      );
      const newSelectedValues = { ...selectedValues };
      
      if (selectedOption) {
        newSelectedValues[dimension] = {
          brand: selectedOption.brand,
          performance: selectedOption.performance
        };
        setSelectedValues(newSelectedValues);
      }
    }
    
    setSelections(newSelections);
  };

  return (
    <div className="p-4 font-sans" dir="rtl">
      <h2 className="text-xl font-bold mb-4">מחשבון הקצאת תקציב שיווק - מותג מול פרפורמנס</h2>
      
      <div className="mb-6 bg-blue-50 p-4 rounded-lg shadow">
        <p className="mb-2 font-semibold">מדריך 3 שלבים לתכנון תקציב השיווק שלך:</p>
        <ol className="list-decimal list-inside text-sm">
          <li className={currentStep === 1 ? "font-bold text-blue-700" : ""}>חישוב תקציב השיווק השנתי המומלץ</li>
          <li className={currentStep === 2 ? "font-bold text-blue-700" : ""}>הגדרת פרמטרים עסקיים</li>
          <li className={currentStep === 3 ? "font-bold text-blue-700" : ""}>קבלת המלצת חלוקה בין מותג לפרפורמנס</li>
        </ol>
      </div>

      {currentStep === 1 && (
        <Step1
          annualRevenue={annualRevenue}
          setAnnualRevenue={setAnnualRevenue}
          industry={industry}
          setIndustry={setIndustry}
          customBudgetPercent={customBudgetPercent}
          setCustomBudgetPercent={setCustomBudgetPercent}
          customBudgetValue={customBudgetValue}
          setCustomBudgetValue={setCustomBudgetValue}
          marketingBudget={marketingBudget}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <Step2
          selections={selections}
          handleSelectionChange={handleSelectionChange}
          onNext={() => setCurrentStep(3)}
          onPrev={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3
          finalRecommendation={finalRecommendation}
          marketingBudget={marketingBudget}
          brandBudget={brandBudget}
          perfBudget={perfBudget}
          customAllocation={customAllocation}
          setCustomAllocation={setCustomAllocation}
          customAllocationValue={customAllocationValue}
          setCustomAllocationValue={setCustomAllocationValue}
          selections={selections}
          onPrev={() => setCurrentStep(2)}
        />
      )}
    </div>
  );
};

export default BrandPerformanceCalculator; 