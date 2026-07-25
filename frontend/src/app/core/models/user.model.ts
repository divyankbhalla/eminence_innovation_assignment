export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE';
    manager?: string;
    teamLead?: {
        _id: string;
        username: string;
    } | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}