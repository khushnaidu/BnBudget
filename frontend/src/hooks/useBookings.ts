import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types/bookingTypes';
import { API_ENDPOINTS } from '../config/api';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(API_ENDPOINTS.bookings, {
        params: { owner_id: user.id },
      });

      const grouped = res.data;

      const flat = Object.entries(grouped).flatMap(([propertyId, bookings]) =>
        (bookings as any[]).map((b) => ({
          ...b,
          property_id: Number(propertyId),
        }))
      );

      setBookings(flat);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  return { bookings, loading, error, fetchBookings };
};
