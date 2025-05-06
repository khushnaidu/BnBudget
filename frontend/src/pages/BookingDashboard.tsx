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
  TextField,
} from "@mui/material";
import { useBookings } from "../hooks/useBookings";
import { useProperties } from "../hooks/useProperties";
import { Booking } from "../types/bookingTypes";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ErrorAlert from "../components/shared/ErrorAlert";

const BookingDashboard: React.FC = () => {
  const { bookings, loading, error, fetchBookings } = useBookings();
  const { properties, loading: propsLoading } = useProperties();

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const propertyIds = Array.from(new Set(bookings.map((b) => b.property_id)));
  const statuses = Array.from(new Set(bookings.map((b) => b.status)));

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const statusMatch = selectedStatus === "All" || b.status === selectedStatus;
      const propertyMatch =
        selectedProperty === "All" || Number(b.property_id) === Number(selectedProperty);
      const checkIn = new Date(b.check_in);
      const startMatch = !startDate || checkIn >= new Date(startDate);
      const endMatch = !endDate || checkIn <= new Date(endDate);
      return statusMatch && propertyMatch && startMatch && endMatch;
    });
  }, [bookings, selectedStatus, selectedProperty, startDate, endDate]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const flatExportData = useMemo(() => {
    return filtered.map((b) => ({
      Property:
        properties.find((p) => Number(p.property_id) === Number(b.property_id))?.name || b.property_id,
      Guest: b.guest_name,
      CheckIn: b.check_in,
      CheckOut: b.check_out,
      Status: b.status,
      Total: b.total,
    }));
  }, [filtered, properties]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [[
        "Property", "Guest", "Check-In", "Check-Out", "Status", "Total ($)"
      ]],
      body: filtered.map((b) => [
        properties.find((p) => Number(p.property_id) === Number(b.property_id))?.name || b.property_id,
        b.guest_name,
        b.check_in,
        b.check_out,
        b.status,
        b.total.toFixed(2)
      ]),
    });
    doc.save("bookings.pdf");
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Booking Dashboard
      </Typography>

      {loading || propsLoading ? (
        <Typography>Loading bookings and properties...</Typography>
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
              {propertyIds.map((pid, index) => {
                const name =
                  properties.find((p) => Number(p.property_id) === Number(pid))?.name || pid;
                return (
                  <MenuItem key={`property-${pid}-${index}`} value={pid}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>

            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />

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
                  <TableCell>Property</TableCell>
                  <TableCell>Guest</TableCell>
                  <TableCell>Check-In</TableCell>
                  <TableCell>Check-Out</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((b, index) => (
                  <TableRow key={`booking-${index}`} hover>
                    <TableCell>
                      {properties.find((p) => Number(p.property_id) === Number(b.property_id))?.name ||
                        b.property_id}
                    </TableCell>
                    <TableCell>{b.guest_name}</TableCell>
                    <TableCell>{b.check_in}</TableCell>
                    <TableCell>{b.check_out}</TableCell>
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
