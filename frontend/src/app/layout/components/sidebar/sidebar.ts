import { Component, inject } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { AuthStateService } from '../../../../app/features/tasks/services/auth-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
constructor() {
  console.log('Role:', this.auth.role);
  console.log('User:', this.auth.user);
  console.log('Is Manager:', this.auth.isManager());
}
  auth = inject(AuthStateService);

}