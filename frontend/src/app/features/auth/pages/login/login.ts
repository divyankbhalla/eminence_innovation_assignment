import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../../core/services/auth.service';
import { SocketService } from '../../../../core/services/socket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private socket = inject(SocketService);

  hidePassword = true;
  loading = false;

  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
      ],
    ],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {

        const token = response.data.token;

        localStorage.setItem('token', token);

        this.socket.connect(token);

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {
        console.error(error);

        alert(error.error.message);
      },

      complete: () => {
        this.loading = false;
      },
    });
    console.log(this.loginForm.value);
  }
}