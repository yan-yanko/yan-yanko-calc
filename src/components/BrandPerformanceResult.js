import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { InfoIcon } from "lucide-react";
import { buildExplanation } from "../utils/buildExplanation";

const COLORS = ["#3B82F6", "#FACC15"];

export default function BrandPerformanceResult({ finalRecommendation, selections, profile }) {
  const data = [
    { name: "מותג", value: finalRecommendation.brand },
    { name: "פרפורמנס", value: finalRecommendation.performance },
  ];

  // בניית ההסבר מתוך selections
  const explanation = buildExplanation(selections);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="rounded-2xl shadow-md border border-slate-200 bg-white">
        <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">המלצת הקצאה</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={data} 
                  cx="50%" 
                  cy="50%" 
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80} 
                  dataKey="value"
                >
                  {data.map((entry, index) => (
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
} 