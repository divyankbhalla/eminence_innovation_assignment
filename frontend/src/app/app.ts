import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SocketService } from './core/services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  private socket = inject(SocketService);

  constructor() {

    const token = localStorage.getItem('token');

    if (token) {
      this.socket.connect(token);
    }

  }

}