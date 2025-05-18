#pragma once

#include <string>
#include <vector>
#include <utility>

struct OrderBook {
    std::string timestamp;
    std::string exchange;
    std::string symbol;
    std::vector<std::pair<double, double>> asks;
    std::vector<std::pair<double, double>> bids; 
};