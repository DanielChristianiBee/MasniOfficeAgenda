import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { Appointment } from './appointment.model';
import { Observable } from 'rxjs';
import { signOut } from 'firebase/auth';

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
  private auth: any;
  private db: any;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    isSupported()
      .then((supported) => {
        if (supported) {
          getAnalytics(this.app);
        }
      })
      .catch((error) => {
        console.error("Analytics not supported:", error);
      });

    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login successful');
    } catch (error: unknown) {
      this.handleError(error);
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred during login");
    }
  }

  async addAppointment(appointment: Appointment): Promise<void> {
    if (!appointment.date) {
      throw new Error("Appointment date is required");
    }
    try {
      const docRef = await addDoc(collection(this.db, 'appointments'), {
        date: appointment.date,
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
          date: doc.data()['date'] as Timestamp,
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

  private handleError(e: unknown): void {
    if (e instanceof Error) {
      console.error("Error:", e.message);
    } else {
      console.error("Error:", e);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Logout successful');
    } catch (error: unknown) {
      this.handleError(error);
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred during logout");
    }
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}
