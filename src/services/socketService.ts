import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
let socket: Socket | null = null;

export const socketService = {
  connect(userId: string) {
    if (!socket) {
      socket = io(SOCKET_URL, {
        query: { userId },
        transports: ['websocket'],
      });
    }
  },
  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
  on(event: string, callback: (...args: any[]) => void) {
    if (socket) {
      socket.on(event, callback);
    }
  },
  off(event: string, callback?: (...args: any[]) => void) {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  },
  emit(event: string, data?: any) {
    if (socket) {
      socket.emit(event, data);
    }
  },
  isConnected() {
    return !!socket && socket.connected;
  }
};