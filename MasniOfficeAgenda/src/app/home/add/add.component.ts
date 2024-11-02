import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../appointment.model';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase.service'; // Import the service
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { Timestamp } from 'firebase/firestore'; // Import Firestore Timestamp

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  @Output() appointmentAdded = new EventEmitter<Appointment>();

  date: Date | null = null; 
  startTime: string = ''; 
  endTime: string = ''; 
  title: string = ''; 
  description: string = '';

  constructor(private firebaseService: FirebaseService) {} // Inject FirebaseService

  addAppointment() {
    // Ensure all fields are filled out
    if (this.date && this.startTime && this.endTime && this.title && this.description) {
      const newAppointment: Appointment = {
        id: uuidv4(), // Generate a unique ID
        date: Timestamp.fromDate(this.date), // Convert the Date to Firestore Timestamp
        startTime: this.startTime,
        endTime: this.endTime,
        title: this.title,
        description: this.description,
      };

      this.firebaseService.addAppointment(newAppointment).then(() => {
        this.appointmentAdded.emit(newAppointment); // Emit only after successful save
        this.resetForm();
      }).catch(error => {
        console.error('Error adding appointment: ', error);
        // Handle error (e.g., show a message to the user)
      });
    } else {
      console.error('All fields are required');
      // Handle invalid input case (show message or similar)
    }
  }

  resetForm() {
    this.date = null; 
    this.startTime = ''; 
    this.endTime = ''; 
    this.title = ''; 
    this.description = ''; 
  }
}
