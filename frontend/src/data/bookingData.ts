// src/data/bookingData.ts
export interface Booking {
    booking_id: number;
    property_id: number;
    guest_name: string;
    check_in: string;
    check_out: string;
    nights: number;
    guests: number;
    season: string;
    subtotal: number;
    cleaning_fee: number;
    service_fee: number;
    tax: number;
    total: number;
    booking_date: string;
    status: string;
    cancellation_date?: string;
    refund_amount?: number;
  }
  
  export const bookings: Booking[] = [
    {
      booking_id: 5001,
      property_id: 1001,
      guest_name: "Alex Johnson",
      check_in: "2023-05-15",
      check_out: "2023-05-18",
      nights: 3,
      guests: 2,
      season: "Peak",
      subtotal: 540,
      cleaning_fee: 75,
      service_fee: 86.1,
      tax: 54.59,
      total: 755.69,
      booking_date: "2023-04-10",
      status: "Completed",
    },
    {
      booking_id: 5002,
      property_id: 1002,
      guest_name: "Emily Chen",
      check_in: "2023-06-01",
      check_out: "2023-06-08",
      nights: 7,
      guests: 4,
      season: "Peak",
      subtotal: 2450,
      cleaning_fee: 120,
      service_fee: 359.8,
      tax: 175.8,
      total: 3105.6,
      booking_date: "2023-05-15",
      status: "Completed",
    },
    {
      booking_id: 5005,
      property_id: 1005,
      guest_name: "James Wilson",
      check_in: "2023-09-10",
      check_out: "2023-09-15",
      nights: 5,
      guests: 2,
      season: "Off",
      subtotal: 800,
      cleaning_fee: 80,
      service_fee: 123.2,
      tax: 49.6,
      total: 1052.8,
      booking_date: "2023-08-01",
      status: "Cancelled",
      cancellation_date: "2023-08-15",
      refund_amount: 840,
    },
    // add more if needed
  ];