import { Injectable, signal } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { UserInfo } from '../../models/user-info.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = user(this.firebaseAuth);
  constructor(private firebaseAuth: Auth, private http: HttpClient) {}

  login(email: string, password: string): Observable<UserCredential> {
    const promise = this.firebaseAuth
      .setPersistence(browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(this.firebaseAuth, email, password);
      })
      .then((response) => response);
    return from(promise);
  }

  register(userInfo: {
    email: string;
    name: string;
    password: string;
  }): Observable<void> {
    const promise = this.firebaseAuth
      .setPersistence(browserSessionPersistence)
      .then(() => {
        return createUserWithEmailAndPassword(
          this.firebaseAuth,
          userInfo.email,
          userInfo.password
        );
      })
      .then((response) => {
        return updateProfile(response.user, { displayName: userInfo.name });
      });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {});
    return from(promise);
  }

  getUserData(uId: string, accessToken: string) {
    return this.http.get(
      `https://online-publishing-platfo-417f1-default-rtdb.firebaseio.com/users/${uId}.json?auth=${accessToken}`
    );
  }

  insertUserData(newUserExtraInfo: any, uid: string, accessToken: string) {
    return this.http.put(
      `https://online-publishing-platfo-417f1-default-rtdb.firebaseio.com/users/${uid}.json?auth=${accessToken}`,
      newUserExtraInfo
    );
  }

  signinWithGoogle(): Observable<UserCredential> {
    const promise = this.firebaseAuth
      .setPersistence(browserSessionPersistence)
      .then(() => {
        return signInWithPopup(this.firebaseAuth, new GoogleAuthProvider());
      })
      .then((response) => response);

    return from(promise);
  }
}
