export interface Appointment {
    id?: string; // Optional ID for Firebase
    date: Date; // The date of the appointment
    time: string; // The time of the appointment
    description: string; // Description of the appointment
  }