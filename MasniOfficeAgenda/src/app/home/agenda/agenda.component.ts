import { Component, OnInit } from '@angular/core';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths, isSameDay } from 'date-fns';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../firebase.service';
import { RouterLink } from '@angular/router';
import { Appointment } from '../../appointment.model'; 
import { getAnalytics, isSupported } from 'firebase/analytics'; 
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  currentMonth: Date = new Date();
  daysInMonth: Date[] = [];
  selectedDay: Date | null = null;
  timeSlots: { label: string, startTime: string, endTime: string }[] = [];
  appointments: Appointment[] = []; // Initialize appointments array
  appointmentsForSelectedDay: Appointment[] = []; // Store appointments for the selected day

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    const analyticsEnabled = await isSupported();
    if (analyticsEnabled) {
      const analytics = getAnalytics();
    }
    
    this.generateMonthDays();
    this.loadAppointments(); // Load appointments when the component initializes
  }

  generateMonthDays() {
    const start = startOfMonth(this.currentMonth);
    const end = endOfMonth(this.currentMonth);
    this.daysInMonth = eachDayOfInterval({ start, end });
  }

  loadAppointments() {
    this.firebaseService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data; 
        console.log('Loaded appointments:', JSON.stringify(this.appointments, null, 2));
      },
      error: (error: any) => {
        console.error("Error loading appointments:", error);
      }
    });
  }

  openDay(day: Date) {
    this.selectedDay = day;
    this.generateTimeSlots();
    this.updateAppointmentsForSelectedDay(); // Update appointments for the selected day
  }

  closeDay() {
    this.selectedDay = null;
    this.appointmentsForSelectedDay = []; // Clear appointments when closing the day view
  }

  generateTimeSlots() {
    this.timeSlots = Array.from({ length: 15 }, (_, i) => {
      const hour = 7 + i; // Adjust start hour as needed
      return {
        label: `${hour}:00 - ${hour + 1}:00`,
        startTime: `${hour}:00`,
        endTime: `${hour + 1}:00`,
      };
    });
  }

  isTimeInSlot(startTime: string, time: { startTime: string, endTime: string }): boolean {
    const appointmentStartTime = new Date(`1970-01-01T${startTime}:00`);
    const slotStartTime = new Date(`1970-01-01T${time.startTime}:00`);
    const slotEndTime = new Date(`1970-01-01T${time.endTime}:00`);

    return appointmentStartTime >= slotStartTime && appointmentStartTime < slotEndTime;
  }

  previousMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
    this.generateMonthDays();
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
    this.generateMonthDays();
  }

  updateAppointmentsForSelectedDay() {
    this.appointmentsForSelectedDay = this.getAppointmentsForSelectedDay(); // Get appointments once and store
  }

  getAppointmentsForSelectedDay(): Appointment[] {
    if (!this.selectedDay) return [];
    
    const selectedDayDate = new Date(this.selectedDay).setHours(0, 0, 0, 0); // Normalize to midnight
    console.log('Selected Day:', selectedDayDate); // Log the selected day
  
    return this.appointments.filter(appointment => {
      const appointmentDate = appointment.date instanceof Timestamp 
        ? appointment.date.toDate().setHours(0, 0, 0, 0) // Normalize to midnight after conversion
        : new Date(appointment.date).setHours(0, 0, 0, 0);
  
      console.log('Checking appointment date:', appointmentDate); // Log each appointment date
      return isSameDay(appointmentDate, selectedDayDate);
    });
  }

  areAppointmentsInTimeSlot(time: any): boolean {
    return this.appointmentsForSelectedDay.some(appointment => 
      this.isTimeInSlot(appointment.startTime, time)
    );
  }
  
}
