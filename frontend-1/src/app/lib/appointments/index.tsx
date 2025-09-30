import { apiClient } from "@/app/utils/api";

// Define types for the appointment data
interface User {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface WeekAvailability {
  // Define properties based on WeekAvailabilitySerializer
  id: number;
  doctor: User;
  // Add other relevant fields
}

interface WeekDay {
  // Define properties based on WeekDaySerializer
  id: number;
  day: string;
  // Add other relevant fields
}

interface Appointment {
  appointment_id: number;
  week_availability: WeekAvailability;
  weekday: WeekDay;
  time: string;
  active: boolean;
  patient?: User;
  doctor?: User;
}

interface AppointmentsResponse {
  active_appointments?: Appointment[];
  inactive_appointments?: Appointment[];
}

// Fetch all appointments (both active and inactive)
export const fetchAllAppointments = async (): Promise<AppointmentsResponse> => {
  try {
    const response = await apiClient.get('appointments/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    throw error;
  }
};

// Fetch only active appointments
export const fetchActiveAppointments = async (): Promise<AppointmentsResponse> => {
  try {
    const response = await apiClient.get('appointments/?status=active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active appointments:', error);
    throw error;
  }
};

// Fetch only inactive appointments
export const fetchInactiveAppointments = async (): Promise<AppointmentsResponse> => {
  try {
    const response = await apiClient.get('appointments/?status=inactive');
    return response.data;
  } catch (error) {
    console.error('Error fetching inactive appointments:', error);
    throw error;
  }
};