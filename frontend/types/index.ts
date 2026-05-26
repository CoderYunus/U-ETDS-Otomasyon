export interface Passenger {
  tcNo: string;
  firstName: string;
  lastName: string;
  nationality: string;
  phone: string;
}

export interface TripDetails {
  departureCity: string;
  departureDistrict: string;
  arrivalCity: string;
  arrivalDistrict: string;
  description: string;
}

export interface ParseResponse {
  success: boolean;
  data?: Passenger[];
  tripDetails?: TripDetails;
  message?: string;
}

export interface SubmitResponse {
  success: boolean;
  message: string;
}
