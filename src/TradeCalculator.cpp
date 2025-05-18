#include "TradeCalculator.h"
#include <cmath>
#include <QDateTime>

SimulationOutputs TradeCalculator::calculateMetrics(const SimulationInputs& inputs) {
    auto startTime = QDateTime::currentMSecsSinceEpoch();
    
    SimulationOutputs outputs;
    outputs.expectedSlippage = calculateSlippage(orderBook, inputs.quantity);
    outputs.expectedFees = calculateFees(inputs.quantity, inputs.feeTier);
    outputs.expectedMarketImpact = calculateMarketImpact(orderBook, inputs.quantity, inputs.volatility);
    outputs.makerTakerProportion = calculateMakerTakerProportion(orderBook, inputs.quantity);
    
    outputs.netCost = (outputs.expectedSlippage * inputs.quantity) + 
                     outputs.expectedFees + 
                     (outputs.expectedMarketImpact * inputs.quantity);
                     
    outputs.internalLatency = QDateTime::currentMSecsSinceEpoch() - startTime;
    outputs.timestamp = QDateTime::currentDateTime().toString("hh:mm:ss");
    
    return outputs;
}

double TradeCalculator::calculateSlippage(const OrderBook& orderBook, double quantity) {
    if (orderBook.asks.empty()) return 0.0;
    
    double remainingQty = quantity;
    double totalCost = 0.0;
    double midPrice = getMidPrice(orderBook);
    
    for (const auto& [price, size] : orderBook.asks) {
        double levelSize = size * price;
        
        if (remainingQty <= levelSize) {
            totalCost += remainingQty * (price / midPrice - 1);
            remainingQty = 0;
            break;
        } else {
            totalCost += levelSize * (price / midPrice - 1);
            remainingQty -= levelSize;
        }
    }
    
    if (remainingQty > 0) {
        totalCost += remainingQty * 0.01;
    }
    
    return totalCost / quantity;
}

double TradeCalculator::calculateFees(double quantity, const QString& feeTier) {
    QMap<QString, double> feeTiers {
        {"VIP1", 0.0008},
        {"VIP2", 0.0007},
        {"VIP3", 0.0006},
        {"VIP4", 0.0005},
        {"VIP5", 0.0004}
    };
    
    return quantity * feeTiers.value(feeTier, 0.0008);
}

double TradeCalculator::calculateMarketImpact(const OrderBook& orderBook, double quantity, double volatility) {
    double estimatedDailyVolume = 0.0;
    
    for (const auto& [_, size] : orderBook.asks) {
        estimatedDailyVolume += size;
    }
    
    for (const auto& [_, size] : orderBook.bids) {
        estimatedDailyVolume += size;
    }
    
    estimatedDailyVolume *= 100;
    
    if (estimatedDailyVolume <= 0) {
        estimatedDailyVolume = quantity * 1000;
    }
    
    double midPrice = getMidPrice(orderBook);
    double normalizedQuantity = quantity / midPrice;
    
    return volatility * std::sqrt(normalizedQuantity / estimatedDailyVolume);
}

double TradeCalculator::calculateMakerTakerProportion(const OrderBook& orderBook, double quantity) {
    double depth = std::min(orderBook.asks.size(), orderBook.bids.size());
    
    double liquidity = 0.0;
    for (const auto& [price, size] : orderBook.asks) {
        liquidity += price * size;
    }
    for (const auto& [price, size] : orderBook.bids) {
        liquidity += price * size;
    }
    
    double makerProportion = std::min(0.8, (depth * liquidity) / (quantity * 10));
    return makerProportion / (1 - makerProportion);
}

double TradeCalculator::getMidPrice(const OrderBook& orderBook) {
    if (orderBook.asks.empty() || orderBook.bids.empty()) {
        return 0.0;
    }
    
    return (orderBook.asks[0].first + orderBook.bids[0].first) / 2.0;
}