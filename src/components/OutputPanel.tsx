import React from 'react';
import { LineChart, BarChartBig } from 'lucide-react';
import { formatCurrency, formatPercentage, formatTime } from '../utils/formatters';
import type { SimulationOutputs, Orderbook } from '../types';
import OrderbookVisualizer from './OrderbookVisualizer';

interface OutputPanelProps {
  outputs: SimulationOutputs;
  orderbook: Orderbook | null;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ outputs, orderbook }) => {
  const {
    expectedSlippage,
    expectedFees,
    expectedMarketImpact,
    netCost,
    makerTakerProportion,
    internalLatency,
    timestamp,
  } = outputs;

  const OutputMetric = ({ label, value, formatter, unit = '' }: { 
    label: string, 
    value: number, 
    formatter?: (val: number) => string,
    unit?: string
  }) => (
    <div className="mb-4">
      <div className="text-sm font-medium text-slate-400">{label}</div>
      <div className="text-xl font-mono">
        {formatter ? formatter(value) : value.toFixed(4)}{unit}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-lg p-6 h-full overflow-hidden flex flex-col">
      <div className="flex items-center mb-6">
        <LineChart className="h-5 w-5 text-green-500 mr-2" />
        <h2 className="text-xl font-semibold">Output Metrics</h2>
      </div>
      
      {timestamp && (
        <div className="mb-4 text-xs text-slate-400">
          Last updated: {formatTime(timestamp)}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <OutputMetric 
          label="Expected Slippage" 
          value={expectedSlippage} 
          formatter={formatPercentage} 
        />
        
        <OutputMetric 
          label="Expected Fees" 
          value={expectedFees} 
          formatter={formatCurrency} 
          unit=" USD"
        />
        
        <OutputMetric 
          label="Market Impact" 
          value={expectedMarketImpact} 
          formatter={formatPercentage} 
        />
        
        <OutputMetric 
          label="Net Cost" 
          value={netCost} 
          formatter={formatCurrency}
          unit=" USD" 
        />
        
        <OutputMetric 
          label="Maker/Taker Ratio" 
          value={makerTakerProportion} 
          formatter={(val) => val.toFixed(2)}
        />
        
        <OutputMetric 
          label="Internal Latency" 
          value={internalLatency} 
          formatter={(val) => val.toFixed(2)}
          unit=" ms" 
        />
      </div>
      
      <div className="mt-auto">
        <div className="flex items-center mb-3">
          <BarChartBig className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Orderbook Visualization</h3>
        </div>
        
        {orderbook ? (
          <OrderbookVisualizer orderbook={orderbook} />
        ) : (
          <div className="h-40 flex items-center justify-center bg-slate-700 rounded-md">
            <p className="text-slate-400">Waiting for orderbook data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;