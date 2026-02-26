declare module 'socket.io-client/dist/socket.io.js' {
    import { Socket } from 'socket.io-client';
    export function io(uri?: string, opts?: any): Socket;
}
