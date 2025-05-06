import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Box,
  Button,
  Grid,
  Chip
} from '@mui/material';
import { Property } from '../types/propertyTypes';
import { MonetizationOn, CalendarMonth, BarChart } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 


interface DetailData {
  property: Property;
  seasonal_pricing: {
    season: string;
    start_date: string;
    end_date: string;
    rate_multiplier: number;
  }[];
  recent_status: string;
  latest_summary: {
    month: number;
    year: number;
    total_revenue: number;
    net_income: number;
  } | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: DetailData | null;
}

const PropertyDetailModal: React.FC<Props> = ({ open, onClose, data }) => {
  if (!data) return null;

  const { property, seasonal_pricing, recent_status, latest_summary } = data;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ borderRadius: 3 }}>
      <DialogTitle fontWeight={700} sx={{ fontSize: '1.5rem', pb: 0 }}>
        {property?.name}
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <Typography variant="body1" fontWeight={500} color="text.secondary" gutterBottom>
          Location: {property?.location}
        </Typography>

        <Grid container spacing={3} mt={1}>
          {/* Nightly Rates */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              <MonetizationOn fontSize="small" sx={{ mr: 1 }} />
              Nightly Rates & Fees
            </Typography>
            <Box ml={1}>
              <Typography variant="body2">Base Rate: ${property?.base_nightly_rate}</Typography>
              <Typography variant="body2">Cleaning Fee: ${property?.cleaning_fee}</Typography>
              <Typography variant="body2">Service Fee: {property?.service_fee_percent}%</Typography>
              <Typography variant="body2">Tax Rate: {property?.tax_rate_percent}%</Typography>
            </Box>
          </Grid>

          {/* Booking Status & Summary */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              <CalendarMonth fontSize="small" sx={{ mr: 1 }} />
              Booking Status
            </Typography>
            <Chip
              label={recent_status}
              color={recent_status === 'Completed' ? 'success' : 'warning'}
              variant="outlined"
              size="small"
              sx={{ ml: 1, mb: 2 }}
            />

            <Typography variant="h6" fontWeight={600}>
              <BarChart fontSize="small" sx={{ mr: 1 }} />
              Latest Monthly Summary
            </Typography>
            {latest_summary ? (
              <Box ml={1}>
                <Typography variant="body2">Month: {latest_summary.month}/{latest_summary.year}</Typography>
                <Typography variant="body2" fontWeight={600}>
                  Revenue: ${latest_summary.total_revenue}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Net Income: ${latest_summary.net_income}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2">No summary available</Typography>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={600} gutterBottom>
          Seasonal Pricing
        </Typography>
        {seasonal_pricing.length === 0 ? (
          <Typography variant="body2" mt={1}>No seasonal pricing configured.</Typography>
        ) : (
          <Grid container spacing={2}>
            {seasonal_pricing.map((s, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box
                  sx={{
                    border: '1px solid #eee',
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Typography fontWeight={600}>{s.season}</Typography>
                  <Typography variant="body2">
                    {s.start_date} → {s.end_date}
                  </Typography>
                  <Typography variant="body2">
                    Multiplier: {s.rate_multiplier}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        <Box mt={4} display="flex" justifyContent="center">
            <Button
                variant="contained"
                size="large"
                onClick={async () => {
                    try {
                    const res = await fetch(`/api/property/${property.property_id}/monthly_summary`);
                    const summaryData = await res.json();
                    console.log("📊 Summary fetched:", summaryData);

                    const doc = new jsPDF();
                    doc.setFontSize(16);
                    doc.text(`${property.name} — Monthly Summary Report`, 14, 20);

                    const tableData = summaryData.map((s: any) => [
                        `${s.month}/${s.year}`,
                        s.bookings,
                        s.nights_booked,
                        `${s.occupancy_percent}%`,
                        `$${s.rental_income}`,
                        `$${s.cleaning_fees}`,
                        `$${s.service_fees}`,
                        `$${s.tax_collected}`,
                        `$${s.total_revenue}`,
                        `$${s.expenses}`,
                        `$${s.net_income}`
                    ]);

                    autoTable(doc, {
                        head: [[
                          'Month', 'Bookings', 'Nights', 'Occupancy', 'Rent',
                          'Cleaning', 'Service', 'Tax', 'Revenue', 'Expenses', 'Net'
                        ]],
                        body: tableData,
                        startY: 30,
                        styles: { fontSize: 8 },
                        headStyles: { fillColor: [255, 90, 95] },
                      });

                    doc.save(`${property.name.replace(/\s+/g, '_')}_monthly_summary.pdf`);
                    } catch (err) {
                    console.error("Failed to generate report", err);
                    }
                }}
                sx={{
                    backgroundColor: '#ff5a5f',
                    '&:hover': { backgroundColor: '#e04e53' },
                    fontWeight: 600,
                    px: 4,
                }}
                >
                GENERATE FULL MONTHLY REPORT
            </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailModal;
