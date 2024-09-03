import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgStyle } from '@angular/common';
import { AuthService } from '../shared/services/auth/auth.service';
import { switchMap } from 'rxjs';
import { firebaseConfig } from '../app.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isSubmit = false;
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * @description called when the component is loaded to initialize the data and form
   * @memberOf LoginComponent
   */
  ngOnInit() {
    this.isSubmit = false;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    this.isSubmit = true;
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .pipe(
          switchMap((userData: any) =>
            this.authService.getUserData(userData.user.uid)
          )
        )
        .subscribe({
          next: (userExtraInfo: any) => {
            let userInfo = userExtraInfo;
            if (userInfo) {
              if (!userInfo.bookmarks) {
                userInfo.bookmarks = [];
              }
              sessionStorage.setItem('userExtraInfo', JSON.stringify(userInfo));
            }
            this.router.navigate(['/home']);
          },
          error: () => {
            alert('Something went Wrong in getting User Data !!');
          },
        });
    }
  }

  signInWithGoogle() {
    this.authService
      .signinWithGoogle()
      .pipe(
        switchMap((userData: any) =>
          this.authService.getUserData(userData.user.uid)
        )
      )
      .subscribe({
        next: (userExtraInfo: any) => {
          if (userExtraInfo) {
            sessionStorage.setItem(
              'userExtraInfo',
              JSON.stringify(userExtraInfo)
            );
            this.router.navigate(['/home']);
          } else {
            let user = JSON.parse(
              sessionStorage.getItem(
                `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
              ) as string
            );
            let userExtraInfo = {
              email: user.email,
              role: 'reader',
              bookmarks: [],
            };
            this.authService.insertUserData(userExtraInfo, user.uid).subscribe({
              next: () => {
                sessionStorage.setItem(
                  'userExtraInfo',
                  JSON.stringify(userExtraInfo)
                );
                console.log('Signed In User-', user);
                this.router.navigate(['/home']);
              },
              error: () => {
                alert('Something went wrong in storing user data !!');
              },
            });
          }
        },
        error: () => {
          alert('Something went Wrong in Signin !!');
        },
      });
  }
}
