export interface Property {
  property_id: number;
  name: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  base_nightly_rate: number;
  peak_season_rate: number;
  off_season_rate: number;
  cleaning_fee: number;
  service_fee_percent: number;
  tax_rate_percent: number;
  owner_id: number;
  status: string;
}
