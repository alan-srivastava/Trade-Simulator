import React from 'react';
import { Settings } from 'lucide-react';
import type { SimulationInputs } from '../types';

interface InputPanelProps {
  inputs: SimulationInputs;
  onInputChange: (name: string, value: any) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ inputs, onInputChange }) => {
  // Available assets for selection
  const assets = ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'XRP-USDT', 'BNB-USDT'];
  
  // Fee tiers based on OKX documentation
  const feeTiers = ['VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5'];
  
  // Order types
  const orderTypes = ['market', 'limit'];
  
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onInputChange(field, value);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 h-full">
      <div className="flex items-center mb-6">
        <Settings className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold">Input Parameters</h2>
      </div>
      
      <div className="space-y-6">
        {/* Exchange Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Exchange
          </label>
          <select 
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.exchange}
            onChange={(e) => onInputChange('exchange', e.target.value)}
            disabled
          >
            <option value="OKX">OKX</option>
          </select>
          <p className="mt-1 text-xs text-slate-400">Currently only OKX is supported</p>
        </div>
        
        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Asset
          </label>
          <select 
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.asset}
            onChange={(e) => onInputChange('asset', e.target.value)}
          >
            {assets.map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
        </div>
        
        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Order Type
          </label>
          <select 
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.orderType}
            onChange={(e) => onInputChange('orderType', e.target.value)}
          >
            {orderTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
        
        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Quantity (USD)
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 pr-12 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputs.quantity}
              onChange={(e) => handleNumberInput(e, 'quantity')}
              min="1"
              step="1"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-slate-400">USD</span>
            </div>
          </div>
        </div>
        
        {/* Volatility Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Market Volatility
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 pr-12 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputs.volatility}
              onChange={(e) => handleNumberInput(e, 'volatility')}
              min="0.01"
              max="1"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-slate-400">%</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-400">Daily volatility (0.01-1.00)</p>
        </div>
        
        {/* Fee Tier */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Fee Tier
          </label>
          <select 
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.feeTier}
            onChange={(e) => onInputChange('feeTier', e.target.value)}
          >
            {feeTiers.map(tier => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;