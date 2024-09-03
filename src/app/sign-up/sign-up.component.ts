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
import { StateManagementService } from '../shared/services/state-management/state-management.service';
import { firebaseConfig } from '../app.config';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgStyle],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  isSubmit = false;

  /**
   * Creates an instance of SignUpComponent.
   * @param {FormBuilder} formBuilder
   * @param {Router} router
   *
   * @memberOf SignUpComponent
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private stateManagementService: StateManagementService
  ) {}

  /**
   * @description creates a form and initializes the data
   * @memberOf SignUpComponent
   */
  ngOnInit() {
    this.isSubmit = false;
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['reader', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  signup() {
    this.isSubmit = true;
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: () => {
          let user = JSON.parse(
            sessionStorage.getItem(
              `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
            ) as string
          );
          if (user) {
            let userExtraInfo = {
              role: this.signupForm.value.role,
              email: this.signupForm.value.email,
              bookmarks: [],
            };
            this.authService.insertUserData(userExtraInfo, user.uid).subscribe({
              next: () => {
                sessionStorage.setItem(
                  'userExtraInfo',
                  JSON.stringify(userExtraInfo)
                );
                alert(`Signup Successful for ${user.displayName}`);
                console.log('Signed In User-', user);
                this.router.navigate(['/home']);
              },
              error: () => {
                alert('Something went wrong !!');
              },
            });
          }
        },
        error: (error) => {
          alert(error.code);
        },
      });
    }
  }
}
