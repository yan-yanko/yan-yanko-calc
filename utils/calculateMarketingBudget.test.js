import { calculateMarketingBudget } from './calculateMarketingBudget';
import { marketingPercentages } from '../data/marketingPercentages';
import { areaMultipliers, audienceSizeMultipliers } from '../data/constants';

// Mock console.warn to avoid cluttering test output
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

describe('calculateMarketingBudget', () => {
  // מקרה בסיסי - קלט רגיל
  test('calculates budget correctly with standard input', () => {
    const input = {
      annualRevenue: 1000000,
      industry: "B2B שירותים",  // 8% מתוך marketingPercentages
      customBudgetPercent: false,
      customBudgetValue: 0,
      operationArea: "רק בישראל",  // מקדם 0.7
      audienceSize: "בין 10,000 ל-100,000"  // מקדם 0.85
    };
    
    // Budget = 1000000 * (8/100) * 0.7 * 0.85 = 47600
    const expected = 47600;
    expect(calculateMarketingBudget(input)).toBe(expected);
  });

  // תקציב מותאם אישית
  test('calculates budget correctly with custom budget percentage', () => {
    const input = {
      annualRevenue: 500000,
      industry: "אחר",  // לא צריך להשפיע כי customBudgetPercent = true
      customBudgetPercent: true,
      customBudgetValue: 5,  // 5%
      operationArea: "גלובלי",  // מקדם 1.1
      audienceSize: "מעל מיליון לקוחות פוטנציאליים"  // מקדם 1.1
    };
    
    // Budget = 500000 * (5/100) * 1.1 * 1.1 = 30250
    const expected = 30250;
    expect(calculateMarketingBudget(input)).toBe(expected);
  });

  // תעשייה לא קיימת
  test('returns null when industry is not found', () => {
    const input = {
      annualRevenue: 1000000,
      industry: "תעשייה לא קיימת",
      customBudgetPercent: false,
      customBudgetValue: 0,
      operationArea: "רק בישראל",
      audienceSize: "בין 10,000 ל-100,000"
    };
    
    expect(calculateMarketingBudget(input)).toBeNull();
    expect(console.warn).toHaveBeenCalledWith("Industry not found:", "תעשייה לא קיימת");
  });

  // חסר אזור פעילות
  test('uses default multiplier when operationArea is missing', () => {
    const input = {
      annualRevenue: 1000000,
      industry: "B2B שירותים",  // 8%
      customBudgetPercent: false,
      customBudgetValue: 0,
      operationArea: undefined,  // default multiplier 1
      audienceSize: "בין 10,000 ל-100,000"  // 0.85
    };
    
    // Budget = 1000000 * (8/100) * 1 * 0.85 = 68000
    const expected = 68000;
    expect(calculateMarketingBudget(input)).toBe(expected);
  });

  // חסר גודל קהל
  test('uses default multiplier when audienceSize is missing', () => {
    const input = {
      annualRevenue: 1000000,
      industry: "B2B שירותים",  // 8%
      customBudgetPercent: false,
      customBudgetValue: 0,
      operationArea: "רק בישראל",  // 0.7
      audienceSize: ""  // default multiplier 1
    };
    
    // Budget = 1000000 * (8/100) * 0.7 * 1 = 56000
    const expected = 56000;
    expect(calculateMarketingBudget(input)).toBe(expected);
  });

  // הכנסה שנתית אפס
  test('returns zero when annualRevenue is zero', () => {
    const input = {
      annualRevenue: 0,
      industry: "B2B שירותים",
      customBudgetPercent: false,
      customBudgetValue: 0,
      operationArea: "רק בישראל",
      audienceSize: "בין 10,000 ל-100,000"
    };
    
    expect(calculateMarketingBudget(input)).toBe(0);
  });

  // הכנסה שנתית שלילית
  test('handles negative annualRevenue by using absolute value', () => {
    const input = {
      annualRevenue: -1000000,
      industry: "B2B שירותים",  // 8%
      customBudgetPercent: false,
      customBudgetValue: 0,
      operationArea: "רק בישראל",  // 0.7
      audienceSize: "בין 10,000 ל-100,000"  // 0.85
    };
    
    // We expect the function to take the absolute value
    // Budget = 1000000 * (8/100) * 0.7 * 0.85 = 47600
    const expected = 47600;
    expect(calculateMarketingBudget(input)).toBe(expected);
  });

  // אחוז תקציב מותאם אישית אפס
  test('returns zero with custom budget percentage set to zero', () => {
    const input = {
      annualRevenue: 1000000,
      industry: "B2B שירותים",
      customBudgetPercent: true,
      customBudgetValue: 0,  // 0%
      operationArea: "רק בישראל",
      audienceSize: "בין 10,000 ל-100,000"
    };
    
    expect(calculateMarketingBudget(input)).toBe(0);
  });

  // קלט חלקי מאוד
  test('handles minimal input with defaults', () => {
    const input = {
      annualRevenue: 1000000,
      industry: "B2B שירותים",  // 8%
      // missing other fields
    };
    
    // We expect the function to use default values for missing fields
    // customBudgetPercent defaulting to false
    // operationArea and audienceSize defaulting to a multiplier of 1
    // Budget = 1000000 * (8/100) * 1 * 1 = 80000
    const expected = 80000;
    expect(calculateMarketingBudget(input)).toBe(expected);
  });
}); 