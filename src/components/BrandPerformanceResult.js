import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { InfoIcon } from "lucide-react";
import { buildExplanation } from "../utils/buildExplanation";

const COLORS = ['#6366F1', '#10B981']; // סגול לברנד, ירוק לפרפורמנס

const BrandPerformanceResult = ({
  finalRecommendation,
  marketingBudget,
  brandBudget,
  perfBudget,
  onReset,
  selections,
  profile
}) => {
  // ערכים בטוחים במקרה של null
  const safeMarketingBudget = marketingBudget ?? 0;
  const safeBrandBudget = brandBudget ?? 0;
  const safePerfBudget = perfBudget ?? 0;

  const getPieData = () => [
    { name: 'מותג', value: finalRecommendation.brand },
    { name: 'פרפורמנס', value: finalRecommendation.performance }
  ];

  const renderLabel = ({ name, percent }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  // בניית ההסבר מתוך selections
  const explanation = buildExplanation(selections);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-center">המלצת החלוקה בין מותג לפרפורמנס</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getPieData()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={renderLabel}
              >
                {getPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold mb-4 text-lg">
            תקציב שיווק שנתי מומלץ:
          </h4>
          {marketingBudget !== null ? (
            <p className="text-3xl font-bold mb-6">{safeMarketingBudget.toLocaleString()} ₪</p>
          ) : (
            <p className="text-xl font-bold mb-6 text-gray-500">יש להזין פרטים לחישוב התקציב</p>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-purple-100 rounded-lg text-center">
              <p className="text-lg font-semibold mb-1">מותג:</p>
              <p className="font-bold">{finalRecommendation.brand}%</p>
              {brandBudget !== null ? (
                <p className="text-xl font-bold text-purple-700">{safeBrandBudget.toLocaleString()} ₪</p>
              ) : (
                <p className="text-gray-500">לא ניתן לחשב</p>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-center">
              <p className="text-lg font-semibold mb-1">פרפורמנס:</p>
              <p className="font-bold">{finalRecommendation.performance}%</p>
              {perfBudget !== null ? (
                <p className="text-xl font-bold text-green-700">{safePerfBudget.toLocaleString()} ₪</p>
              ) : (
                <p className="text-gray-500">לא ניתן לחשב</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          התחל מחדש
        </button>
      </div>

      <div className="rounded-2xl shadow-md border border-slate-200 bg-white mt-8">
        <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">המלצת הקצאה</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={getPieData()} 
                  cx="50%" 
                  cy="50%" 
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80} 
                  dataKey="value"
                >
                  {getPieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div className="text-slate-700">
              <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                <InfoIcon className="w-5 h-5 text-blue-500" /> למה ההמלצה הזו?
              </h3>
              <p className="text-sm leading-relaxed">{explanation}</p>
            </div>

            {profile && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-blue-800 font-semibold text-md flex items-center gap-2">
                  {profile.emoji} {profile.title}
                </h4>
                <p className="text-blue-700 text-sm mt-1 leading-relaxed">{profile.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPerformanceResult; 