import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() showSideButtons: string = 'none';
  @Input() title = 'Online Publishing Platform';
  userExtraInfo: any;

  /**
   * Creates an instance of HeaderComponent.
   * @param {Store} store
   * @param {Router} router
   *
   * @memberOf HeaderComponent
   */
  constructor(
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userExtraInfo = JSON.parse(
      sessionStorage.getItem('userExtraInfo') as string
    );
  }

  goBack() {
    this.location.back();
  }
  /**
   * @description this function is used to signout the user
   * @memberOf HeaderComponent
   */
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('userExtraInfo');
        alert('Logout Successful!');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Something went wrong. Please try again !!');
      },
    });
  }
}
