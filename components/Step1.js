import React from 'react';
import { marketingPercentages } from '../data/marketingPercentages';

const Step1 = ({
  annualRevenue,
  setAnnualRevenue,
  industry,
  setIndustry,
  customBudgetPercent,
  setCustomBudgetPercent,
  customBudgetValue,
  setCustomBudgetValue,
  marketingBudget,
  onNext
}) => {
  const handleRevenueChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setAnnualRevenue(value);
  };

  const handleCustomBudgetChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setCustomBudgetValue(Math.min(Math.max(value, 1), 50));
  };

  const getIndustryRecommendation = () => {
    const selected = marketingPercentages.find(item => item.industry === industry);
    return selected ? selected : { percentage: 10, note: "ממוצע כללי למגוון תעשיות" };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">שלב 1: חישוב תקציב השיווק השנתי המומלץ</h3>
      
      <div className="mb-6">
        <label className="block mb-2 font-semibold">מחזור מכירות שנתי (₪):</label>
        <input
          type="number"
          value={annualRevenue}
          onChange={handleRevenueChange}
          min="0"
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-semibold">תחום העסק:</label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">-- בחר --</option>
          {marketingPercentages.map(item => (
            <option key={item.industry} value={item.industry}>
              {item.industry} ({item.percentage}%)
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-6 bg-gray-50 p-4 rounded">
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
          <p className="text-2xl font-bold">{marketingBudget.toLocaleString()} ₪</p>
          <p className="text-sm text-gray-600">
            {customBudgetPercent 
              ? `${customBudgetValue}% ממחזור המכירות השנתי`
              : industry 
                ? `${getIndustryRecommendation().percentage}% ממחזור המכירות השנתי`
                : "בחר תחום עסקי כדי לקבל המלצה מדויקת יותר"}
          </p>
          
          {industry && !customBudgetPercent && (
            <p className="mt-2 text-sm">{getIndustryRecommendation().note}</p>
          )}
        </div>
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

export default Step1; 