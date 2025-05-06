export interface Booking {
    booking_id: number;
    property_id: number;
    guest_name: string;
    check_in: string; // ISO date
    check_out: string;
    nights: number;
    guests: number;
    status: string;
    total: number;
    cancellation_date?: string;
    refund_amount?: number;
  }
  