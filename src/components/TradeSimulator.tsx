import React, { useState, useEffect } from 'react';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import WebSocketManager from '../services/WebSocketManager';
import { calculateTradeMetrics } from '../services/TradeCalculator';
import { useOrderbook } from '../hooks/useOrderbook';
import type { SimulationInputs, SimulationOutputs } from '../types';

const TradeSimulator: React.FC = () => {
  // Default input parameters
  const [inputs, setInputs] = useState<SimulationInputs>({
    exchange: 'OKX',
    asset: 'BTC-USDT',
    orderType: 'market',
    quantity: 100,
    volatility: 0.05,
    feeTier: 'VIP1',
  });

  // Initial output state
  const [outputs, setOutputs] = useState<SimulationOutputs>({
    expectedSlippage: 0,
    expectedFees: 0,
    expectedMarketImpact: 0,
    netCost: 0,
    makerTakerProportion: 0,
    internalLatency: 0,
    timestamp: '',
  });

  // Use our custom hook to manage orderbook state
  const { orderbook, latency } = useOrderbook();

  // Recalculate metrics whenever inputs or orderbook changes
  useEffect(() => {
    if (orderbook && orderbook.asks.length > 0 && orderbook.bids.length > 0) {
      const startTime = performance.now();
      
      const metrics = calculateTradeMetrics(
        orderbook,
        inputs,
        latency
      );
      
      const calculationLatency = performance.now() - startTime;
      
      setOutputs({
        ...metrics,
        internalLatency: calculationLatency,
        timestamp: orderbook.timestamp,
      });
    }
  }, [inputs, orderbook, latency]);

  // Handle input changes
  const handleInputChange = (name: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InputPanel 
        inputs={inputs} 
        onInputChange={handleInputChange} 
      />
      <OutputPanel 
        outputs={outputs}
        orderbook={orderbook}
      />
    </div>
  );
};

export default TradeSimulator;