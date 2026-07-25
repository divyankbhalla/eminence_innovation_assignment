import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LoginRequest } from '../models/login.model';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse } from '../models/auth-response.model';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
    private socket = inject(SocketService);

    login(
        data: LoginRequest
    ): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(
            `${environment.apiUrl}/auth/login`,
            data
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    saveAuth(response: AuthResponse) {
        localStorage.setItem('token', response.token);
        localStorage.setItem(
            'user',
            JSON.stringify(response.user)
        );
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');

        return user ? JSON.parse(user) : null;
    }

    isLoggedIn() {
        return !!this.getToken();
    }
}