import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AuthService from './AuthService';

class WebSocketService {
    constructor() {
        this.client = null;
    }

    connect() {
        if (this.client !== null && this.client.active) {
            return;
        }

        const user = AuthService.getCurrentUser();
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // 실제 WebSocket 엔드포인트로 변경
            connectHeaders: {
                Authorization: user && user.token ? `Bearer ${user.token}` : '',
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket 연결됨');
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        this.client.activate();
    }

    /**
     * WebSocket을 구독하고 구독 객체를 반환합니다.
     * @param {string} destination - 구독할 목적지
     * @param {function} callback - 메시지 수신 시 호출될 콜백 함수
     * @returns {object} subscription - 구독 객체
     */
    subscribe(destination, callback) {
        if (this.client && this.client.connected) {
            return this.client.subscribe(destination, (message) => {
                const body = JSON.parse(message.body);
                callback(body);
            });
        } else {
            // WebSocket이 아직 연결되지 않은 경우 연결 후 구독
            this.client.onConnect = () => {
                this.client.subscribe(destination, (message) => {
                    const body = JSON.parse(message.body);
                    callback(body);
                });
            };
            this.connect();
        }
    }

    /**
     * 메시지를 전송합니다.
     * @param {string} destination - 메시지를 보낼 목적지
     * @param {object} message - 전송할 메시지 객체
     */
    sendMessage(destination, message) {
        if (this.client && this.client.connected) {
            this.client.publish({ destination, body: JSON.stringify(message) });
        } else {
            console.error('WebSocket이 연결되지 않았습니다.');
        }
    }

    /**
     * WebSocket 연결을 해제합니다.
     */
    disconnect() {
        if (this.client) {
            this.client.deactivate();
            console.log('WebSocket 연결 해제됨');
        }
    }
}

const instance = new WebSocketService();
export default instance;