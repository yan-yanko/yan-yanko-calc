import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { useBudgetCalculation } from '../hooks/useBudgetCalculation';
import { useRecommendationCalculation } from '../hooks/useRecommendationCalculation';
import { recommendationsData } from '../data/recommendationsData';
import { marketingPercentages } from '../data/marketingPercentages';
import { areaMultipliers, audienceSizeMultipliers } from '../data/constants';

const BrandPerformanceCalculator = () => {
  // מצב פנימי של הקומפוננטה
  const [currentStep, setCurrentStep] = useState(1);
  const [annualRevenue, setAnnualRevenue] = useState(1000000);
  const [industry, setIndustry] = useState("");
  const [customBudgetPercent, setCustomBudgetPercent] = useState(false);
  const [customBudgetValue, setCustomBudgetValue] = useState(10);
  const [operationArea, setOperationArea] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [selections, setSelections] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [customAllocation, setCustomAllocation] = useState(false);
  const [customAllocationValue, setCustomAllocationValue] = useState(60);
  const [errors, setErrors] = useState({});

  // חישוב תקציב שיווק
  const marketingBudget = useBudgetCalculation(
    annualRevenue,
    industry,
    customBudgetPercent,
    customBudgetValue,
    operationArea,
    audienceSize
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

  const validateStep1 = () => {
    if (!industry) {
      setErrors(prev => ({ ...prev, step1: 'חובה לבחור תחום עסקי' }));
      return false;
    }
    if (!operationArea) {
      setErrors(prev => ({ ...prev, step1: 'חובה לבחור אזור פעילות' }));
      return false;
    }
    if (!audienceSize) {
      setErrors(prev => ({ ...prev, step1: 'חובה לבחור גודל קהל' }));
      return false;
    }
    setErrors(prev => ({ ...prev, step1: '' }));
    return true;
  };

  console.log("currentStep:", currentStep);

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
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-6">שלב 1: חישוב תקציב השיווק השנתי המומלץ</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* טור ימני - שדות קלט */}
            <div>
              <div className="mb-8">
                <label className="block mb-3 font-semibold text-lg">מחזור מכירות שנתי (₪):</label>
                <input
                  type="text"
                  value={annualRevenue.toLocaleString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
                    setAnnualRevenue(value);
                  }}
                  min="0"
                  className="p-3 border border-gray-300 rounded w-full text-lg"
                />
              </div>
              
              <div className="mb-8">
                <label className="block mb-3 font-semibold text-lg">תחום העסק: <span className="text-red-500">*</span></label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={`p-3 border ${!industry ? 'border-red-500' : 'border-gray-300'} rounded w-full text-lg`}
                >
                  <option value="">-- בחר --</option>
                  {marketingPercentages.map(item => (
                    <option key={item.industry} value={item.industry}>
                      {item.industry}
                    </option>
                  ))}
                </select>
                {!industry && <p className="text-red-500 text-base mt-2">חובה לבחור תחום עסקי</p>}
              </div>

              <div className="mb-8">
                <label className="block mb-3 font-semibold text-lg">אזור פעילות: <span className="text-red-500">*</span></label>
                <select
                  value={operationArea}
                  onChange={(e) => setOperationArea(e.target.value)}
                  className={`p-3 border ${!operationArea ? 'border-red-500' : 'border-gray-300'} rounded w-full text-lg`}
                >
                  <option value="">-- בחר --</option>
                  {Object.keys(areaMultipliers).map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {!operationArea && <p className="text-red-500 text-base mt-2">חובה לבחור אזור פעילות</p>}
              </div>

              <div className="mb-8">
                <label className="block mb-3 font-semibold text-lg">גודל קהל פוטנציאלי: <span className="text-red-500">*</span></label>
                <select
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(e.target.value)}
                  className={`p-3 border ${!audienceSize ? 'border-red-500' : 'border-gray-300'} rounded w-full text-lg`}
                >
                  <option value="">-- בחר --</option>
                  {Object.keys(audienceSizeMultipliers).map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {!audienceSize && <p className="text-red-500 text-base mt-2">חובה לבחור גודל קהל</p>}
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="customBudget"
                  checked={customBudgetPercent}
                  onChange={(e) => setCustomBudgetPercent(e.target.checked)}
                  className="ml-3 w-5 h-5"
                />
                <label htmlFor="customBudget" className="font-semibold text-lg">הגדר אחוז תקציב שיווק מותאם אישית</label>
              </div>

              {customBudgetPercent && (
                <div className="mb-6">
                  <label className="block mb-3 text-lg">אחוז ממחזור המכירות השנתי: {customBudgetValue}%</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={customBudgetValue}
                    onChange={(e) => setCustomBudgetValue(parseInt(e.target.value, 10))}
                    className="w-full h-3"
                  />
                  <div className="flex justify-between text-base text-gray-600 mt-2">
                    <span>1%</span>
                    <span>15%</span>
                    <span>30%</span>
                  </div>
                </div>
              )}
            </div>

            {/* טור שמאלי - תצוגת תקציב */}
            <div className="text-center">
              <h4 className="font-bold text-xl mb-4">תקציב השיווק השנתי המומלץ:</h4>
              <p className="text-4xl font-bold mb-4" style={{ color: '#2563eb' }}>
                {marketingBudget.toLocaleString()} ₪
              </p>
              
              {industry && !customBudgetPercent && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg mb-2">
                    {marketingPercentages.find(item => item.industry === industry)?.percentage}% ממחזור המכירות השנתי
                  </p>
                  <p className="text-base">
                    {marketingPercentages.find(item => item.industry === industry)?.note}
                  </p>
                </div>
              )}

              {customBudgetPercent && (
                <p className="text-lg text-gray-600 mb-4">
                  {customBudgetValue}% ממחזור המכירות השנתי
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!validateStep1()}
              className={`px-8 py-3 text-white rounded text-lg font-semibold transition-colors ${validateStep1() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              המשך לשלב הבא
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        (() => {
          console.log("Passing props to Step2:", { industry, annualRevenue, marketingBudget });
          return (
            <Step2
              industry={industry}
              annualRevenue={annualRevenue}
              marketingBudget={marketingBudget}
              selections={selections}
              handleSelectionChange={handleSelectionChange}
              onNext={() => setCurrentStep(3)}
              onPrev={() => setCurrentStep(1)}
            />
          );
        })()
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