import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface CurrentUser {
    id: string;
    role: 'MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE';
    iat: number;
    exp: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {

    private get decodedToken(): CurrentUser | null {

        const token = localStorage.getItem('token');

        if (!token) {
            return null;
        }

        try {
            return jwtDecode<CurrentUser>(token);
        } catch {
            return null;
        }

    }

    get user() {
        return this.decodedToken;
    }

    get userId(): string {
        return this.decodedToken?.id ?? '';
    }

    get role(): string {
        return this.decodedToken?.role ?? '';
    }

    isManager(): boolean {
        return this.role === 'MANAGER';
    }

    isTeamLead(): boolean {
        return this.role === 'TEAM_LEAD';
    }

    isEmployee(): boolean {
        return this.role === 'EMPLOYEE';
    }

    logout() {
        localStorage.removeItem('token');
    }

}