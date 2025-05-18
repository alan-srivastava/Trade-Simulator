import React, { useMemo } from 'react';
import type { Orderbook } from '../types';

interface OrderbookVisualizerProps {
  orderbook: Orderbook;
}

const OrderbookVisualizer: React.FC<OrderbookVisualizerProps> = ({ orderbook }) => {
  // Calculate the mid price from the best bid and ask
  const midPrice = useMemo(() => {
    if (orderbook.asks.length > 0 && orderbook.bids.length > 0) {
      const bestAsk = parseFloat(orderbook.asks[0][0]);
      const bestBid = parseFloat(orderbook.bids[0][0]);
      return (bestAsk + bestBid) / 2;
    }
    return 0;
  }, [orderbook]);

  // Calculate the total volume and max volume for visualization
  const { maxBidVolume, maxAskVolume, topBids, topAsks } = useMemo(() => {
    const numLevels = 5; // Display top 5 levels
    
    const topBids = orderbook.bids.slice(0, numLevels).map(([price, size]) => ({
      price: parseFloat(price),
      size: parseFloat(size)
    }));
    
    const topAsks = orderbook.asks.slice(0, numLevels).map(([price, size]) => ({
      price: parseFloat(price),
      size: parseFloat(size)
    }));
    
    const maxBidVolume = Math.max(...topBids.map(b => b.size), 1);
    const maxAskVolume = Math.max(...topAsks.map(a => a.size), 1);
    
    return { maxBidVolume, maxAskVolume, topBids, topAsks };
  }, [orderbook]);

  return (
    <div className="h-48 bg-slate-900 rounded-md p-3 overflow-hidden">
      {midPrice > 0 ? (
        <>
          <div className="text-center mb-2">
            <span className="text-xs text-slate-400">Mid Price: </span>
            <span className="text-sm font-mono font-semibold">${midPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex h-36">
            {/* Bids (Buy orders) */}
            <div className="w-1/2 pr-1 space-y-1">
              {topBids.map((bid, i) => (
                <div key={`bid-${i}`} className="flex items-center h-6">
                  <div 
                    className="h-full bg-green-500/20 rounded-sm flex items-center justify-end px-1"
                    style={{ width: `${(bid.size / maxBidVolume) * 100}%` }}
                  >
                    <span className="text-xs text-green-500 font-mono whitespace-nowrap">
                      {bid.size.toFixed(2)}
                    </span>
                  </div>
                  <div className="ml-1 text-xs text-slate-200 font-mono">
                    {bid.price.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Asks (Sell orders) */}
            <div className="w-1/2 pl-1 space-y-1">
              {topAsks.map((ask, i) => (
                <div key={`ask-${i}`} className="flex items-center h-6">
                  <div className="mr-1 text-xs text-slate-200 font-mono">
                    {ask.price.toFixed(1)}
                  </div>
                  <div 
                    className="h-full bg-red-500/20 rounded-sm flex items-center px-1"
                    style={{ width: `${(ask.size / maxAskVolume) * 100}%` }}
                  >
                    <span className="text-xs text-red-500 font-mono whitespace-nowrap">
                      {ask.size.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-slate-400">Loading orderbook data...</p>
        </div>
      )}
    </div>
  );
};

export default OrderbookVisualizer;