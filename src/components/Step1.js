import React, { useState, useEffect } from 'react';
import marketingPercentages from '../data/marketingPercentages';
import { generatePersonalizedRecommendation } from '../utils/generateRecommendation';

const Step1 = ({
  annualRevenue,
  setAnnualRevenue,
  industry,
  setIndustry,
  customBudgetPercent,
  setCustomBudgetPercent,
  customBudgetValue,
  setCustomBudgetValue,
  audienceSize,
  setAudienceSize,
  marketingBudget,
  onNext
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [baseRecommendation, setBaseRecommendation] = useState(null);
  const [personalizedRecommendation, setPersonalizedRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(industry);

  // אפקט שמעדכן את selectedIndustry כשמשתנה industry מה-props
  useEffect(() => {
    setSelectedIndustry(industry);
  }, [industry]);

  // אפקט שמופעל בכל פעם שמשתנה אחד הפרמטרים שמשפיעים על החישוב
  useEffect(() => {
    if (industry && audienceSize && !customBudgetPercent) {
      setIsCalculating(true);
      setShowResult(false);
      
      // השהייה מלאכותית לפני הצגת התוצאה
      const timer = setTimeout(() => {
        setIsCalculating(false);
        setShowResult(true);
      }, 1500); // השהייה של 1.5 שניות
      
      return () => clearTimeout(timer);
    }
  }, [industry, audienceSize, customBudgetPercent]);

  useEffect(() => {
    if (baseRecommendation && selectedIndustry) {
      setIsLoading(true);
      generatePersonalizedRecommendation(selectedIndustry, baseRecommendation)
        .then(result => {
          setPersonalizedRecommendation(result);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error generating personalized recommendation:', error);
          setIsLoading(false);
        });
    }
  }, [baseRecommendation, selectedIndustry]);

  console.log("✅ Step1.js loaded", { audienceSize });

  const handleRevenueChange = (e) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
    setAnnualRevenue(value);
  };

  const handleCustomBudgetChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setCustomBudgetValue(Math.min(Math.max(value, 1), 50));
  };

  const getIndustryRecommendation = () => {
    const selected = marketingPercentages.find(item => item.industry === industry);
    const basePercentage = selected ? selected.percentage : 10;
    let finalPercentage = basePercentage;

    // התאמת האחוז לפי גודל קהל היעד
    if (audienceSize) {
      switch (audienceSize) {
        case "עד 10,000 לקוחות פוטנציאליים":
          finalPercentage = basePercentage * 0.8;
          break;
        case "בין 10,000 ל-100,000":
          finalPercentage = basePercentage;
          break;
        case "בין 100,000 ל-1,000,000":
          finalPercentage = basePercentage * 1.2;
          break;
        case "מעל מיליון":
          finalPercentage = basePercentage * 1.4;
          break;
        default:
          finalPercentage = basePercentage;
      }
    }

    return {
      percentage: Math.round(finalPercentage * 10) / 10, // עיגול לספרה אחת אחרי הנקודה
      note: selected ? selected.note : "ממוצע כללי למגוון תעשיות",
      basePercentage,
      tips: selected ? selected.tips : []
    };
  };

  // ערך בטוח ל-marketingBudget
  const safeMarketingBudget = marketingBudget ?? 0;
  const shouldShowBudget = industry && audienceSize;

  // חישוב התקציב לפי האחוז החדש
  const industryRecommendation = getIndustryRecommendation();
  const calculatedBudget = Math.round((annualRevenue * industryRecommendation.percentage) / 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">שלב 1: חישוב תקציב השיווק השנתי המומלץ</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* טור ימני - שדות קלט */}
        <div>
          <div className="mb-6">
            <label htmlFor="annualRevenueInput" className="block mb-2 font-semibold">מחזור מכירות שנתי (₪):</label>
            <input
              id="annualRevenueInput"
              type="text"
              value={annualRevenue.toLocaleString()}
              onChange={handleRevenueChange}
              min="0"
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="industrySelect" className="block mb-2 font-semibold">תחום העסק:</label>
            <select
              id="industrySelect"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">-- בחר --</option>
              {marketingPercentages.map(item => (
                <option key={item.industry} value={item.industry}>
                  {item.industry}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="audienceSizeSelect" className="block mb-2 font-semibold">מהו גודל קהל היעד של העסק שלך?</label>
            <select
              id="audienceSizeSelect"
              value={audienceSize}
              onChange={(e) => setAudienceSize(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">-- בחר --</option>
              <option>עד 10,000 לקוחות פוטנציאליים</option>
              <option>בין 10,000 ל-100,000</option>
              <option>בין 100,000 ל-1,000,000</option>
              <option>מעל מיליון</option>
              <option>לא בטוח</option>
            </select>
          </div>
        </div>

        {/* טור שמאלי - תצוגת תקציב */}
        <div>
          {shouldShowBudget ? (
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="customBudget"
                  checked={customBudgetPercent}
                  onChange={(e) => setCustomBudgetPercent(e.target.checked)}
                  className="ml-2"
                />
                <label htmlFor="customBudget" className="font-semibold">הגדר אחוז תקציב שיווק מותאם אישית</label>
              </div>
              
              {customBudgetPercent && (
                <div className="mb-4">
                  <label className="block mb-2">אחוז מהמחזור: {customBudgetValue}%</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={customBudgetValue}
                    onChange={handleCustomBudgetChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>1%</span>
                    <span>15%</span>
                    <span>30%</span>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="font-bold mb-2">תקציב השיווק השנתי המומלץ:</h4>
                
                {isCalculating ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="mr-3 text-gray-600">מחשב המלצה...</span>
                  </div>
                ) : showResult || customBudgetPercent ? (
                  <>
                    <p className="text-2xl font-bold animate-fade-in">
                      {customBudgetPercent 
                        ? Math.round((annualRevenue * customBudgetValue) / 100).toLocaleString() 
                        : calculatedBudget.toLocaleString()} ₪
                      {industry && !customBudgetPercent && (
                        <span className="text-blue-600 ml-2">*</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {customBudgetPercent 
                        ? `${customBudgetValue}% ממחזור המכירות השנתי`
                        : industry 
                          ? `${industryRecommendation.percentage}% ממחזור המכירות השנתי`
                          : "בחר תחום עסקי כדי לקבל המלצה מדויקת יותר"}
                    </p>
                    
                    {industry && !customBudgetPercent && (
                      <div className="mt-4">
                        {audienceSize && industryRecommendation.percentage !== industryRecommendation.basePercentage && (
                          <p className="mb-2 text-sm text-gray-600">
                            * האחוז הותאם לגודל קהל היעד שלך (האחוז הבסיסי לתעשייה הוא {industryRecommendation.basePercentage}%)
                          </p>
                        )}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-blue-800 font-semibold mb-2">המלצה מקצועית מיאן יאנקו:</p>
                          <p className="text-blue-700 mb-2">
                            עסק בתחום {industry} כדאי שישקיע {industryRecommendation.note.toLowerCase()}
                          </p>
                          {industryRecommendation.tips && industryRecommendation.tips.length > 0 && (
                            <div className="mt-2">
                              <p className="text-blue-800 font-semibold mb-1">טיפים מפורטים:</p>
                              <ul className="list-disc list-inside text-blue-700 space-y-1">
                                {industryRecommendation.tips.map((tip, index) => (
                                  <li key={index}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="text-blue-800 font-semibold mt-2">
                            בשלב הבא תוכלו לדעת גם איך לחלק את ההשקעה הזו מבחינת פרפורמנס מרקטינג וברנד מרקטינג
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">יש למלא את כל השדות כדי לקבל המלצת תקציב</p>
            </div>
          )}
        </div>
      </div>

      {/* מקורות */}
      <div className="mt-8 text-base text-gray-600 border-t pt-6">
        <p className="font-bold mb-3">מקורות:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="https://cmosurvey.org/results/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CMO Survey Results</a></li>
          <li><a href="https://www.gartner.com/en/marketing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Gartner Marketing Research</a></li>
          <li><a href="https://www2.deloitte.com/us/en/pages/chief-marketing-officer/articles/cmo-survey.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Deloitte CMO Survey</a></li>
        </ul>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          המשך לשלב הבא
        </button>
      </div>
    </div>
  );
};

// הוספת סגנונות CSS לאנימציות
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default Step1; 