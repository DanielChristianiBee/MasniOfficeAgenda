// src/app/firebase.service.ts

import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics'; // Import isSupported

// Your web app's Firebase configuration
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
  private analytics: any | null; // Set analytics to null initially
  private auth: any;

  constructor() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);

    // Check if analytics is supported before initializing
    isSupported().then((supported) => {
      if (supported) {
        this.analytics = getAnalytics(this.app);
      } else {
        this.analytics = null; // Set analytics to null if not supported
      }
    }).catch((error) => {
      console.error("Analytics not supported:", error);
      this.analytics = null; // Set analytics to null on error
    });

    // Initialize Firebase Authentication
    this.auth = getAuth(this.app);
  }

  // Method to log in the user
  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        // Login successful
        console.log('Login successful');
      })
      .catch((error) => {
        // Handle login errors
        console.error('Login error:', error.message);
        throw new Error(error.message);
      });
  }
}
