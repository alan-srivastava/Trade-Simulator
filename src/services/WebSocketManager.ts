import { Orderbook } from '../types';

class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1s delay
  private onMessageCallback: ((data: Orderbook) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private lastMessageTime = 0;
  private isIntentionalClose = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = url;
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.isIntentionalClose = false;
    this.clearReconnectTimeout();

    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.lastMessageTime = Date.now();
        if (this.onConnectCallback) this.onConnectCallback();
      };
      
      this.ws.onmessage = (event) => {
        this.lastMessageTime = Date.now();
        try {
          const data = JSON.parse(event.data);
          if (this.onMessageCallback) {
            this.onMessageCallback(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          if (this.onErrorCallback) {
            this.onErrorCallback('Failed to parse server message');
          }
        }
      };
      
      this.ws.onerror = (error) => {
        const errorMessage = `WebSocket connection error: ${this.getErrorDetails(error)}. Attempting to reconnect...`;
        console.error('WebSocket error:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(errorMessage);
        }
        
        // Force close the connection to trigger reconnect
        if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
          this.ws.close();
        }
      };
      
      this.ws.onclose = (event) => {
        const closeReason = this.getCloseReason(event);
        console.log(`WebSocket connection closed: ${closeReason}`);
        if (this.onDisconnectCallback) this.onDisconnectCallback();
        
        if (!this.isIntentionalClose) {
          this.attemptReconnect();
        }
      };
      
      // Set up a health check to detect stale connections
      this.startHeartbeat();
      
    } catch (error) {
      const errorMessage = `Failed to establish WebSocket connection: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMessage);
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
      this.attemptReconnect();
    }
  }

  private getErrorDetails(error: Event): string {
    if (error instanceof ErrorEvent) {
      return error.message;
    }
    const target = error.target as WebSocket;
    if (target) {
      return `Connection state: ${this.getReadyStateString(target.readyState)}`;
    }
    return 'Unknown error';
  }

  private getReadyStateString(state: number): string {
    const states = {
      [WebSocket.CONNECTING]: 'Connecting',
      [WebSocket.OPEN]: 'Open',
      [WebSocket.CLOSING]: 'Closing',
      [WebSocket.CLOSED]: 'Closed'
    };
    return states[state] || 'Unknown';
  }

  private getCloseReason(event: CloseEvent): string {
    const codes: { [key: number]: string } = {
      1000: 'Normal closure',
      1001: 'Going away',
      1002: 'Protocol error',
      1003: 'Unsupported data',
      1004: 'Reserved',
      1005: 'No status received',
      1006: 'Abnormal closure',
      1007: 'Invalid frame payload data',
      1008: 'Policy violation',
      1009: 'Message too big',
      1010: 'Mandatory extension',
      1011: 'Internal server error',
      1015: 'TLS handshake'
    };
    
    const reason = event.reason || codes[event.code] || `Unknown (${event.code})`;
    return `${event.code} - ${reason}`;
  }

  public disconnect(): void {
    this.isIntentionalClose = true;
    this.clearReconnectTimeout();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  public onMessage(callback: (data: Orderbook) => void): void {
    this.onMessageCallback = callback;
  }

  public onConnect(callback: () => void): void {
    this.onConnectCallback = callback;
  }

  public onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  public onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  private attemptReconnect(): void {
    if (this.isIntentionalClose) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      const errorMessage = 'Maximum reconnection attempts reached. Please refresh the page to try again.';
      console.log(errorMessage);
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    const retryMessage = `Attempting to reconnect in ${delay/1000} seconds (attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`;
    console.log(retryMessage);
    if (this.onErrorCallback) {
      this.onErrorCallback(retryMessage);
    }
    
    this.clearReconnectTimeout();
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    const interval = setInterval(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        clearInterval(interval);
        return;
      }

      // If no message received for 10 seconds, reconnect
      if (Date.now() - this.lastMessageTime > 10000) {
        const message = 'No messages received for 10 seconds, attempting to reconnect...';
        console.log(message);
        if (this.onErrorCallback) {
          this.onErrorCallback(message);
        }
        this.disconnect();
        this.isIntentionalClose = false; // Reset to allow reconnection
        this.connect();
      }
    }, 5000);
  }
}

// Create a singleton instance for the specific OKX WebSocket endpoint
const webSocketManager = new WebSocketManager('wss://ws.gomarket-cpp.goquant.io/ws/l2-orderbook/okx/BTC-USDT-SWAP');

export default webSocketManager;