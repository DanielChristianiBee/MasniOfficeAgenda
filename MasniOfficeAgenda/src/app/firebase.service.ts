import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore'; 
import { getAnalytics, isSupported } from 'firebase/analytics'; 
import { Appointment } from './appointment.model';
import { Observable } from 'rxjs';

const firebaseConfig = {
  apiKey: "AIzaSyBJ4VU8NzNDGCSWE0zgPDpzW8jlmLVUwh8",
  authDomain: "masniofficeagenda.firebaseapp.com",
  projectId: "masniofficeagenda",
  storageBucket: "masniofficeagenda.appspot.com",
  messagingSenderId: "176523511925",
  appId: "1:176523511925:web:3c72a67b5fc3d2e679903c",
  measurementId: "G-P3W83HV194"
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app: any;
  private analytics: any | null; 
  private auth: any;
  private db: any; 

  constructor() {
    this.app = initializeApp(firebaseConfig);
    isSupported().then((supported) => {
      this.analytics = supported ? getAnalytics(this.app) : null; 
    }).catch((error) => {
      console.error("Analytics not supported:", error);
      this.analytics = null; 
    });

    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app); 
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        console.log('Login successful');
      })
      .catch((error) => {
        this.handleError(error);
        throw new Error(error.message);
      });
  }

  async addAppointment(appointment: Appointment): Promise<void> {
    if (!appointment.date) {
      throw new Error("Appointment date is required");
    }
    try {
      const docRef = await addDoc(collection(this.db, 'appointments'), {
        date: appointment.date, // Keep as Timestamp
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        title: appointment.title,
        description: appointment.description,
      });
      console.log("Appointment added with ID:", docRef.id);
    } catch (e: unknown) {
      this.handleError(e);
      throw new Error("Error adding appointment: " + (e instanceof Error ? e.message : "Unknown error"));
    }
  }

  getAppointments(): Observable<Appointment[]> {
    const appointmentsCollection = collection(this.db, 'appointments');
    return new Observable<Appointment[]>(observer => {
      const unsubscribe = onSnapshot(appointmentsCollection, querySnapshot => {
        const appointments: Appointment[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data()['date'] as Timestamp, // Keep as Timestamp
          startTime: doc.data()['startTime'] as string,
          endTime: doc.data()['endTime'] as string,
          title: doc.data()['title'] as string,
          description: doc.data()['description'] as string,
        }) as Appointment);
        observer.next(appointments);
      }, error => {
        observer.error(error);
      });

      return () => unsubscribe(); 
    });
  }

  async updateAppointment(id: string, appointment: Appointment): Promise<void> {
    if (!appointment.date) {
      throw new Error("Appointment date is required");
    }
    try {
      const appointmentRef = doc(this.db, 'appointments', id);
      await updateDoc(appointmentRef, {
        date: appointment.date, // Keep as Timestamp
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        title: appointment.title,
        description: appointment.description,
      });
      console.log("Appointment updated with ID:", id);
    } catch (e: unknown) {
      this.handleError(e);
      throw new Error("Error updating appointment: " + (e instanceof Error ? e.message : "Unknown error"));
    }
  }

  private handleError(e: unknown): void {
    if (e instanceof Error) {
      console.error("Error:", e.message);
    } else {
      console.error("Error:", e);
    }
  }
}
