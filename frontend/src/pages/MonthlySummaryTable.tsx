// src/pages/MonthlySummary.tsx
import React, { useMemo, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useMonthlySummary } from "../hooks/useMonthlySummary";
import PieChartCard from "../components/charts/PieChartCard";


const MonthlySummary: React.FC = () => {
  const { summaries, loading, error } = useMonthlySummary();
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState("All");

  const months = Array.from(new Set(summaries.map((s) => s.month + " " + s.year)));
  const properties = Array.from(new Set(summaries.map((s) => s.propertyName)));

  const filtered = useMemo(() => {
    return summaries.filter((s) => {
      const monthMatch =
        selectedMonth === "All" || `${s.month} ${s.year}` === selectedMonth;
      const propertyMatch =
        selectedProperty === "All" || s.propertyName === selectedProperty;
      return monthMatch && propertyMatch;
    });
  }, [summaries, selectedMonth, selectedProperty]);

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(({ propertyName, profit }) => {
      map[propertyName] = (map[propertyName] || 0) + profit;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Monthly Summary
      </Typography>

      {loading ? (
        <Typography>Loading summary...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* Filters */}
          <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              size="small"
              displayEmpty
            >
              <MenuItem value="All">All Months</MenuItem>
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              size="small"
              displayEmpty
            >
              <MenuItem value="All">All Properties</MenuItem>
              {properties.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {/* Chart */}
          <Box mb={4}>
            <PieChartCard title="Profit by Property" data={chartData} />
          </Box>

          {/* Summary Table */}
          <Paper elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Income ($)</TableCell>
                  <TableCell align="right">Expenses ($)</TableCell>
                  <TableCell align="right">Profit ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.propertyName}</TableCell>
                    <TableCell>{item.month} {item.year}</TableCell>
                    <TableCell align="right">{item.income.toFixed(2)}</TableCell>
                    <TableCell align="right">{item.expenses.toFixed(2)}</TableCell>
                    <TableCell align="right">{item.profit.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default MonthlySummary;