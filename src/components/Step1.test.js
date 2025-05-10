import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1 from './Step1';

describe('Step1 Component', () => {
  const defaultProps = {
    annualRevenue: 1000000,
    setAnnualRevenue: jest.fn(),
    industry: '',
    setIndustry: jest.fn(),
    customBudgetPercent: false,
    setCustomBudgetPercent: jest.fn(),
    customBudgetValue: 10,
    setCustomBudgetValue: jest.fn(),
    audienceSize: '',
    setAudienceSize: jest.fn(),
    marketingBudget: 100000,
    onNext: jest.fn(),
  };

  it('מציג כותרת שלב 1', () => {
    render(<Step1 {...defaultProps} />);
    expect(screen.getByText(/שלב 1: חישוב תקציב השיווק השנתי המומלץ/)).toBeInTheDocument();
  });

  it('מציג שדה תחום העסק', () => {
    render(<Step1 {...defaultProps} />);
    expect(screen.getByLabelText(/תחום העסק/)).toBeInTheDocument();
  });

  it('מאפשר שינוי ערך מחזור שנתי', () => {
    render(<Step1 {...defaultProps} />);
    const input = screen.getByLabelText(/מחזור מכירות שנתי/);
    fireEvent.change(input, { target: { value: '2000000' } });
    expect(defaultProps.setAnnualRevenue).toHaveBeenCalled();
  });
}); 