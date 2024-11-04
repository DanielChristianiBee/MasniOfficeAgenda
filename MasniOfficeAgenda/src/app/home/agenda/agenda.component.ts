import { Component, OnInit } from '@angular/core';
import { startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths, isSameDay } from 'date-fns';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../firebase.service';
import { RouterLink } from '@angular/router';
import { Appointment } from '../../appointment.model';
import { isSupported } from 'firebase/analytics';
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
  appointments: Appointment[] = [];
  appointmentsForSelectedDay: Appointment[] = [];

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    const analyticsEnabled = await isSupported();
    if (analyticsEnabled) {
      // Initialize analytics if supported (if required for further functionality)
    }

    this.generateMonthDays();
    this.loadAppointments();
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
    this.updateAppointmentsForSelectedDay();
  }

  closeDay() {
    this.selectedDay = null;
    this.appointmentsForSelectedDay = [];
  }

  generateTimeSlots() {
    this.timeSlots = Array.from({ length: 15 }, (_, i) => {
      const hour = 7 + i;
      return {
        label: `${hour}:00 - ${hour + 1}:00`,
        startTime: `${hour}:00`,
        endTime: `${hour + 1}:00`,
      };
    });
  }

  isTimeInSlot(startTime: string, time: { startTime: string, endTime: string }): boolean {
    const appointmentStartTime = new Date(`1970-01-01T${startTime.padStart(5, '0')}:00`);
    const slotStartTime = new Date(`1970-01-01T${time.startTime.padStart(5, '0')}:00`);
    const slotEndTime = new Date(`1970-01-01T${time.endTime.padStart(5, '0')}:00`);

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
    this.appointmentsForSelectedDay = this.getAppointmentsForSelectedDay();
  }

  getAppointmentsForSelectedDay(): Appointment[] {
    if (!this.selectedDay) return [];

    const selectedDayDate = new Date(this.selectedDay).setHours(0, 0, 0, 0);
    console.log('Selected Day:', selectedDayDate);

    return this.appointments.filter(appointment => {
      const appointmentDate = (appointment.date as Timestamp).toDate().setHours(0, 0, 0, 0);
      console.log('Checking appointment date:', appointmentDate);
      return isSameDay(appointmentDate, selectedDayDate);
    });
  }

  areAppointmentsInTimeSlot(time: any): boolean {
    return this.appointmentsForSelectedDay.some(appointment =>
      this.isTimeInSlot(appointment.startTime, time)
    );
  }
}
