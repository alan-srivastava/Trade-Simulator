import type { Orderbook, SimulationInputs, SimulationOutputs } from '../types';

/**
 * Calculate all trade metrics based on the current orderbook and input parameters
 */
export function calculateTradeMetrics(
  orderbook: Orderbook,
  inputs: SimulationInputs,
  latency: number
): Omit<SimulationOutputs, 'timestamp'> {
  // Calculate expected slippage
  const slippage = calculateSlippage(orderbook, inputs.quantity);
  
  // Calculate expected fees
  const fees = calculateFees(inputs.quantity, inputs.feeTier);
  
  // Calculate market impact
  const marketImpact = calculateMarketImpact(orderbook, inputs.quantity, inputs.volatility);
  
  // Calculate maker/taker proportion
  const makerTaker = calculateMakerTakerProportion(orderbook, inputs.quantity);
  
  // Calculate net cost (slippage + fees + market impact)
  const netCost = (slippage * inputs.quantity) + fees + (marketImpact * inputs.quantity);
  
  return {
    expectedSlippage: slippage,
    expectedFees: fees,
    expectedMarketImpact: marketImpact,
    netCost,
    makerTakerProportion: makerTaker,
    internalLatency: latency
  };
}

/**
 * Calculate the expected slippage based on the orderbook and quantity
 * Uses a simple linear model that increases with trade size
 */
function calculateSlippage(orderbook: Orderbook, quantity: number): number {
  if (!orderbook.asks.length) return 0;
  
  let remainingQty = quantity;
  let totalCost = 0;
  const midPrice = getMidPrice(orderbook);
  
  // Walk the orderbook
  for (let i = 0; i < orderbook.asks.length; i++) {
    const [priceStr, sizeStr] = orderbook.asks[i];
    const price = parseFloat(priceStr);
    const size = parseFloat(sizeStr);
    
    // Convert size to USD value
    const levelSize = size * price;
    
    if (remainingQty <= levelSize) {
      // This level can fill the remaining quantity
      totalCost += remainingQty * (price / midPrice - 1);
      remainingQty = 0;
      break;
    } else {
      // Take the entire level and continue
      totalCost += levelSize * (price / midPrice - 1);
      remainingQty -= levelSize;
    }
  }
  
  // If there's still remaining quantity, assume maximum slippage
  if (remainingQty > 0) {
    totalCost += remainingQty * 0.01; // Assume 1% slippage for unfilled portion
  }
  
  // Return the average slippage percentage
  return totalCost / quantity;
}

/**
 * Calculate trading fees based on tier
 */
function calculateFees(quantity: number, feeTier: string): number {
  // OKX fee tiers (maker/taker)
  const feeTiers: Record<string, number> = {
    'VIP1': 0.0008, // 0.08%
    'VIP2': 0.0007, // 0.07%
    'VIP3': 0.0006, // 0.06%
    'VIP4': 0.0005, // 0.05%
    'VIP5': 0.0004, // 0.04%
  };
  
  const feeRate = feeTiers[feeTier] || feeTiers['VIP1'];
  return quantity * feeRate;
}

/**
 * Implements Almgren-Chriss market impact model
 * Market impact = σ × sqrt(quantity/V) × sqrt(T)
 * Where:
 * - σ is the volatility
 * - V is the average daily volume
 * - T is the time horizon (1 day)
 */
function calculateMarketImpact(orderbook: Orderbook, quantity: number, volatility: number): number {
  // Estimate daily volume from orderbook (this is a simplification)
  // In a real system, this would come from historical data
  let estimatedDailyVolume = 0;
  
  // Sum up volumes from both sides
  orderbook.asks.forEach(([_, size]) => {
    estimatedDailyVolume += parseFloat(size);
  });
  
  orderbook.bids.forEach(([_, size]) => {
    estimatedDailyVolume += parseFloat(size);
  });
  
  // Multiply by 100 as a rough estimate of how many times the orderbook turns over per day
  estimatedDailyVolume *= 100;
  
  // Prevent division by zero
  if (estimatedDailyVolume <= 0) {
    estimatedDailyVolume = quantity * 1000;
  }
  
  // Calculate market impact
  const midPrice = getMidPrice(orderbook);
  const normalizedQuantity = quantity / midPrice; // Convert to crypto units
  
  // Almgren-Chriss formula with simplified assumptions
  // Market impact = σ × sqrt(quantity/V) × sqrt(T)
  const marketImpact = volatility * Math.sqrt(normalizedQuantity / estimatedDailyVolume);
  
  return marketImpact;
}

/**
 * Calculate the maker/taker proportion
 * Returns a ratio where higher values indicate more maker orders (better)
 */
function calculateMakerTakerProportion(orderbook: Orderbook, quantity: number): number {
  const depth = getOrderbookDepth(orderbook);
  const liquidity = getOrderbookLiquidity(orderbook);
  
  // Model based on orderbook characteristics
  // Higher liquidity and deeper orderbooks allow for more maker orders
  const makerProportion = Math.min(0.8, (depth * liquidity) / (quantity * 10));
  
  // Calculate the maker/taker ratio (higher is better)
  return makerProportion / (1 - makerProportion);
}

/**
 * Helper function to get the mid price from an orderbook
 */
function getMidPrice(orderbook: Orderbook): number {
  if (orderbook.asks.length === 0 || orderbook.bids.length === 0) {
    return 0;
  }
  
  const bestAsk = parseFloat(orderbook.asks[0][0]);
  const bestBid = parseFloat(orderbook.bids[0][0]);
  
  return (bestAsk + bestBid) / 2;
}

/**
 * Helper function to get the depth of the orderbook (number of price levels)
 */
function getOrderbookDepth(orderbook: Orderbook): number {
  return Math.min(orderbook.asks.length, orderbook.bids.length);
}

/**
 * Helper function to get the total liquidity in the orderbook
 */
function getOrderbookLiquidity(orderbook: Orderbook): number {
  let totalLiquidity = 0;
  
  orderbook.asks.forEach(([price, size]) => {
    totalLiquidity += parseFloat(price) * parseFloat(size);
  });
  
  orderbook.bids.forEach(([price, size]) => {
    totalLiquidity += parseFloat(price) * parseFloat(size);
  });
  
  return totalLiquidity;
}