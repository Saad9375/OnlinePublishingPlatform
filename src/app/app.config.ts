import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideHttpClient } from '@angular/common/http';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBuE8Z8rhoJubTRcIq_ZrJ4Qz11cbu2H48',
  authDomain: 'online-publishing-platfo-417f1.firebaseapp.com',
  databaseURL:
    'https://online-publishing-platfo-417f1-default-rtdb.firebaseio.com',
  projectId: 'online-publishing-platfo-417f1',
  storageBucket: 'online-publishing-platfo-417f1.appspot.com',
  messagingSenderId: '988901288221',
  appId: '1:988901288221:web:578f3332dd16758bd999f4',
  measurementId: 'G-PXD413E7VG',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideHttpClient(),
    provideFirestore(() => getFirestore()),

    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
  ],
};
