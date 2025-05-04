import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  Stack,
  Button,
  Chip,
  TablePagination,
} from "@mui/material";
import { useBookings } from "../hooks/useBookings";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ErrorAlert from "../components/shared/ErrorAlert";

const BookingDashboard: React.FC = () => {
  const { bookings, loading, error, fetchBookings } = useBookings();

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const propertyIds = Array.from(new Set(bookings.map((b) => b.property_id)));
  const statuses = Array.from(new Set(bookings.map((b) => b.status)));

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const statusMatch = selectedStatus === "All" || b.status === selectedStatus;
      const propertyMatch = selectedProperty === "All" || b.property_id === Number(selectedProperty);
      return statusMatch && propertyMatch;
    });
  }, [bookings, selectedStatus, selectedProperty]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const flatExportData = useMemo(() => {
    return filtered.map((b) => ({
      BookingID: b.booking_id,
      PropertyID: b.property_id,
      Guest: b.guest_name,
      CheckIn: b.check_in,
      CheckOut: b.check_out,
      Nights: b.nights,
      Guests: b.guests,
      Status: b.status,
      Total: b.total,
      CancellationDate: b.cancellation_date ?? "",
      RefundAmount: b.refund_amount ?? "",
    }));
  }, [filtered]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Booking ID",
          "Property ID",
          "Guest",
          "Check-In",
          "Check-Out",
          "Nights",
          "Guests",
          "Status",
          "Total ($)",
          "Cancellation",
          "Refund ($)",
        ],
      ],
      body: filtered.map((b) => [
        b.booking_id,
        b.property_id,
        b.guest_name,
        b.check_in,
        b.check_out,
        b.nights,
        b.guests,
        b.status,
        b.total.toFixed(2),
        b.cancellation_date || "-",
        b.refund_amount?.toFixed(2) || "-",
      ]),
    });
    doc.save("bookings.pdf");
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Booking Dashboard
      </Typography>

      {loading ? (
        <Typography>Loading bookings...</Typography>
      ) : (
        <>
          <ErrorAlert message={error} title="Failed to load bookings" onRetry={fetchBookings} />

          <Stack direction="row" spacing={2} my={3} flexWrap="wrap">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              size="small"
              displayEmpty
            >
              <MenuItem value="All">All Statuses</MenuItem>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
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
              {propertyIds.map((pid) => (
                <MenuItem key={pid} value={pid}>
                  {pid}
                </MenuItem>
              ))}
            </Select>

            <CSVLink data={flatExportData} filename="bookings.csv" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Export CSV</Button>
            </CSVLink>

            <Button variant="outlined" onClick={exportToPDF}>
              Export PDF
            </Button>
          </Stack>

          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Property ID</TableCell>
                  <TableCell>Guest</TableCell>
                  <TableCell>Check-In</TableCell>
                  <TableCell>Check-Out</TableCell>
                  <TableCell>Nights</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total ($)</TableCell>
                  <TableCell>Cancellation Date</TableCell>
                  <TableCell>Refund ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((b) => (
                  <TableRow key={b.booking_id}>
                    <TableCell>{b.booking_id}</TableCell>
                    <TableCell>{b.property_id}</TableCell>
                    <TableCell>{b.guest_name}</TableCell>
                    <TableCell>{b.check_in}</TableCell>
                    <TableCell>{b.check_out}</TableCell>
                    <TableCell>{b.nights}</TableCell>
                    <TableCell>{b.guests}</TableCell>
                    <TableCell>
                      <Chip
                        label={b.status}
                        color={
                          b.status === "Completed"
                            ? "success"
                            : b.status === "Cancelled"
                            ? "error"
                            : "warning"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{b.total.toFixed(2)}</TableCell>
                    <TableCell>{b.cancellation_date || "-"}</TableCell>
                    <TableCell>
                      {b.refund_amount != null ? `$${b.refund_amount.toFixed(2)}` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        </>
      )}
    </Container>
  );
};

export default BookingDashboard;