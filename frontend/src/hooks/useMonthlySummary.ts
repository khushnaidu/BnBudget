// src/hooks/useMonthlySummary.ts

import { useEffect, useState } from "react";
import { monthlySummaries } from "../data/monthlySummaryData";

export interface MonthlySummary {
  propertyName: string;
  propertyId: string;
  month: string;
  year: number;
  income: number;
  expenses: number;
  profit: number;
}

export const useMonthlySummary = () => {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      setSummaries(monthlySummaries); // mock for now
    } catch (err) {
      setError("Failed to fetch summaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return { summaries, loading, error };
};