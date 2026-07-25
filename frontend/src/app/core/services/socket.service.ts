import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private socket?: Socket;
    connect(token: string) {
        if (this.socket?.connected) {
            return;
        }
        this.socket = io(environment.socketUrl, {
            auth: {
                token,
            },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket Connected', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket Disconnected');
        });
    }

    disconnect() {
        this.socket?.disconnect();
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string) {
        this.socket?.off(event);
    }

}