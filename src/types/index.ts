// Orderbook types
export interface Orderbook {
  timestamp: string;
  exchange: string;
  symbol: string;
  asks: [string, string][]; // [price, size]
  bids: [string, string][]; // [price, size]
}

// Simulation input parameters
export interface SimulationInputs {
  exchange: string;
  asset: string;
  orderType: string;
  quantity: number;
  volatility: number;
  feeTier: string;
}

// Simulation output metrics
export interface SimulationOutputs {
  expectedSlippage: number;
  expectedFees: number;
  expectedMarketImpact: number;
  netCost: number;
  makerTakerProportion: number;
  internalLatency: number;
  timestamp: string;
}