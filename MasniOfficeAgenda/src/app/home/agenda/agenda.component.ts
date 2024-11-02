import { Component, OnInit } from '@angular/core';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths } from 'date-fns';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent implements OnInit {
  currentMonth = new Date();
  daysInMonth: Date[] = [];
  selectedDay: Date | null = null;
  timeSlots: string[] = [];

  ngOnInit() {
    this.generateMonthDays();
  }

  generateMonthDays() {
    const start = startOfMonth(this.currentMonth);
    const end = endOfMonth(this.currentMonth);
    this.daysInMonth = eachDayOfInterval({ start, end });
  }

  openDay(day: Date) {
    this.selectedDay = day;
    this.generateTimeSlots();
}

  closeDay() {
  this.selectedDay= null;
}

  generateTimeSlots() {
  this.timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 7 + i;
    return `${hour}:00 - ${hour + 1}:00`;
  });
}

  previousMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
    this.generateMonthDays();
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
    this.generateMonthDays();
  }
}