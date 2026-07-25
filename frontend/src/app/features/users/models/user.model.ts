export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE';
    manager?: string;
    teamLead?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}