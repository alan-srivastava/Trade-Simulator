import { useState, useEffect, useRef } from 'react';
import webSocketManager from '../services/WebSocketManager';
import type { Orderbook } from '../types';

export function useOrderbook() {
  const [orderbook, setOrderbook] = useState<Orderbook | null>(null);
  const [latency, setLatency] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const lastMessageTime = useRef<number>(0);

  useEffect(() => {
    // Handler for WebSocket messages
    const handleOrderbookUpdate = (data: Orderbook) => {
      const receiveTime = performance.now();
      const messageLatency = lastMessageTime.current > 0 
        ? receiveTime - lastMessageTime.current 
        : 0;
      
      setOrderbook(data);
      setLatency(messageLatency);
      lastMessageTime.current = receiveTime;
    };

    // Connect to WebSocket when component mounts
    webSocketManager.onMessage(handleOrderbookUpdate);
    webSocketManager.onConnect(() => setIsConnected(true));
    webSocketManager.onDisconnect(() => setIsConnected(false));
    
    webSocketManager.connect();

    // Clean up WebSocket connection when component unmounts
    return () => {
      webSocketManager.disconnect();
    };
  }, []);

  return {
    orderbook,
    latency,
    isConnected
  };
}