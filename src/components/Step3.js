import React from 'react';
import BudgetPieChart from './BudgetPieChart';

const Step3 = ({
  finalRecommendation,
  marketingBudget,
  brandBudget,
  perfBudget,
  customAllocation,
  setCustomAllocation,
  customAllocationValue,
  setCustomAllocationValue,
  selections,
  onPrev
}) => {
  const handleCustomAllocationChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setCustomAllocationValue(Math.min(Math.max(value, 0), 100));
  };

  const getPieData = () => [
    { name: 'מותג', value: finalRecommendation.brand },
    { name: 'פרפורמנס', value: finalRecommendation.performance }
  ];

  // הגדרת ערכים בטוחים במקרה של null
  const safeMarketingBudget = marketingBudget ?? 0;
  const safeBrandBudget = brandBudget ?? 0;
  const safePerfBudget = perfBudget ?? 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">שלב 3: המלצת חלוקה בין מותג לפרפורמנס</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* תוצאות ההמלצה */}
        <div>
          <BudgetPieChart data={getPieData()} />
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-2">
              תקציב שיווק שנתי: {marketingBudget !== null 
                ? `${safeMarketingBudget.toLocaleString()} ₪` 
                : 'לא ניתן לחשב'
              }
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-purple-700">מותג:</p>
                <p className="text-xl">{finalRecommendation.brand}%</p>
                <p className="text-lg font-bold">
                  {brandBudget !== null 
                    ? `${safeBrandBudget.toLocaleString()} ₪` 
                    : 'לא ניתן לחשב'
                  }
                </p>
              </div>
              <div>
                <p className="font-semibold text-green-700">פרפורמנס:</p>
                <p className="text-xl">{finalRecommendation.performance}%</p>
                <p className="text-lg font-bold">
                  {perfBudget !== null 
                    ? `${safePerfBudget.toLocaleString()} ₪` 
                    : 'לא ניתן לחשב'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* אפשרויות התאמה אישית */}
        <div>
          <div className="mb-6 border-b pb-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="customAllocation"
                checked={customAllocation}
                onChange={(e) => setCustomAllocation(e.target.checked)}
                className="ml-2"
              />
              <label htmlFor="customAllocation" className="font-semibold">הגדר חלוקה מותאמת אישית</label>
            </div>
            
            {customAllocation && (
              <div className="mt-2">
                <label className="block mb-2">אחוז למותג: {customAllocationValue}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customAllocationValue}
                  onChange={handleCustomAllocationChange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0% מותג</span>
                  <span>50/50</span>
                  <span>100% מותג</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h4 className="font-bold mb-2">פרמטרים שנבחרו:</h4>
            {Object.keys(selections).length > 0 ? (
              <ul className="list-disc list-inside">
                {Object.keys(selections).map(dimension => (
                  <li key={dimension}><b>{dimension}:</b> {selections[dimension]}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">לא נבחרו פרמטרים. התוצאה מבוססת על הממוצע הכללי.</p>
            )}
          </div>
          
          <div className="mt-6 text-sm text-gray-600 border-t pt-4">
            <p>* ההמלצה מבוססת על מחקרים מתוך Effectiveness in Context ו-Media in Focus.</p>
            <p>* התוצאה מחושבת כממוצע של ההמלצות עבור כל הפרמטרים שנבחרו.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          חזרה
        </button>
      </div>
    </div>
  );
};

export default Step3; 