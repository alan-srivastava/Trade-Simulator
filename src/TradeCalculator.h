#pragma once

#include "OrderBook.h"
#include "InputPanel.h"
#include "OutputPanel.h"

class TradeCalculator {
public:
    TradeCalculator() = default;
    SimulationOutputs calculateMetrics(const SimulationInputs& inputs);

private:
    double calculateSlippage(const OrderBook& orderBook, double quantity);
    double calculateFees(double quantity, const QString& feeTier);
    double calculateMarketImpact(const OrderBook& orderBook, double quantity, double volatility);
    double calculateMakerTakerProportion(const OrderBook& orderBook, double quantity);
    double getMidPrice(const OrderBook& orderBook);
};