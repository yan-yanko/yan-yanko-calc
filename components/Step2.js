import React from 'react';
import { recommendationsData } from '../data/recommendationsData';

const Step2 = ({ selections, handleSelectionChange, onNext, onPrev }) => {
  // ארגון הנתונים לפי ממדים
  const getDimensionsAndOptions = () => {
    const dimensions = {};
    recommendationsData.forEach(item => {
      if (!dimensions[item.dimension]) {
        dimensions[item.dimension] = [];
      }
      if (!dimensions[item.dimension].some(option => option.context === item.context)) {
        dimensions[item.dimension].push({
          context: item.context,
          brand: item.brand,
          performance: item.performance
        });
      }
    });
    return dimensions;
  };

  const dimensionsMap = getDimensionsAndOptions();
  const dimensionsList = Object.keys(dimensionsMap);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">שלב 2: הגדרת פרמטרים עסקיים</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensionsList.map(dimension => (
          <div key={dimension} className="mb-4">
            <label className="block mb-2 font-semibold">{dimension}:</label>
            <select
              value={selections[dimension] || ""}
              onChange={(e) => handleSelectionChange(dimension, e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">-- בחר --</option>
              {dimensionsMap[dimension].map(option => (
                <option key={option.context} value={option.context}>
                  {option.context}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          חזרה
        </button>
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

export default Step2; 