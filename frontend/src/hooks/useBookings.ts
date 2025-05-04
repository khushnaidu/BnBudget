// src/hooks/useBookings.ts
import { useEffect, useState } from "react";
import { bookings as mockBookings, Booking } from "../data/bookingData";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      //throw new Error("Simulated failure");
      setBookings(mockBookings); // swap with API call later
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

return { bookings, loading, error, fetchBookings };

};