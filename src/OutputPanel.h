#pragma once

#include <QWidget>
#include <QLabel>
#include <QVBoxLayout>
#include <QTableWidget>
#include <QHeaderView>
#include "OrderBook.h"

/**
 * @brief 
 */
struct SimulationOutputs {
    double expectedSlippage;      
    double expectedFees;          
    double expectedMarketImpact; 
    double netCost;              
    double makerTakerProportion; 
    double internalLatency;      
    QString timestamp;           
};

/**
 * @brief
 */
class OutputPanel : public QWidget {
    Q_OBJECT

public:
    /**
     * @brief 
     * @param parent 
     */
    explicit OutputPanel(QWidget *parent = nullptr);

    /**
     * @brief 
     * @param outputs 
     */
    void updateMetrics(const SimulationOutputs& outputs);

    /**
     * @brief 
     * @param orderBook 
     */
    void updateOrderBook(const OrderBook& orderBook);

private:
    /**
     * @brief 
     */
    void setupUI();

    /**
     * @brief 
     */
    void createMetricsSection();

    /**
     * @brief 
     */
    void createOrderBookChart();

    
    QLabel* slippageLabel;      
    QLabel* feesLabel;          
    QLabel* marketImpactLabel;  
    QLabel* netCostLabel;       
    QLabel* makerTakerLabel;    
    QLabel* latencyLabel;      
    QLabel* timestampLabel;    
    
    QTableWidget* bidTable;     
    QTableWidget* askTable;     
};