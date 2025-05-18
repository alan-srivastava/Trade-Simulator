#include "OutputPanel.h"
#include <QGridLayout>
#include <QGroupBox>

OutputPanel::OutputPanel(QWidget *parent)
    : QWidget(parent)
{
    setupUI();
}

void OutputPanel::setupUI() {
    auto mainLayout = new QVBoxLayout(this);
    
    
    createMetricsSection();
    
    
    createOrderBookChart();
    
    mainLayout->addStretch();
}

void OutputPanel::createMetricsSection() {
    auto metricsGroup = new QGroupBox("Output Metrics");
    auto metricsLayout = new QGridLayout;
    
    slippageLabel = new QLabel("0.00%");
    feesLabel = new QLabel("$0.00");
    marketImpactLabel = new QLabel("0.00%");
    netCostLabel = new QLabel("$0.00");
    makerTakerLabel = new QLabel("0.00");
    latencyLabel = new QLabel("0.00 ms");
    timestampLabel = new QLabel("--:--:--");
    
    int row = 0;
    metricsLayout->addWidget(new QLabel("Expected Slippage:"), row, 0);
    metricsLayout->addWidget(slippageLabel, row++, 1);
    
    metricsLayout->addWidget(new QLabel("Expected Fees:"), row, 0);
    metricsLayout->addWidget(feesLabel, row++, 1);
    
    metricsLayout->addWidget(new QLabel("Market Impact:"), row, 0);
    metricsLayout->addWidget(marketImpactLabel, row++, 1);
    
    metricsLayout->addWidget(new QLabel("Net Cost:"), row, 0);
    metricsLayout->addWidget(netCostLabel, row++, 1);
    
    metricsLayout->addWidget(new QLabel("Maker/Taker Ratio:"), row, 0);
    metricsLayout->addWidget(makerTakerLabel, row++, 1);
    
    metricsLayout->addWidget(new QLabel("Internal Latency:"), row, 0);
    metricsLayout->addWidget(latencyLabel, row++, 1);
    
    metricsLayout->addWidget(new QLabel("Last Update:"), row, 0);
    metricsLayout->addWidget(timestampLabel, row++, 1);
    
    metricsGroup->setLayout(metricsLayout);
    layout()->addWidget(metricsGroup);
}

void OutputPanel::createOrderBookChart() {
    auto orderbookGroup = new QGroupBox("Order Book");
    auto orderbookLayout = new QVBoxLayout;
    
    
    bidTable = new QTableWidget(5, 2);  
    askTable = new QTableWidget(5, 2);
    
    
    bidTable->setHorizontalHeaderLabels({"Size", "Price"});
    bidTable->setStyleSheet(
        "QTableWidget { background-color: #1a1a1a; color: #ffffff; min-width: 300px; }"
        "QHeaderView::section { background-color: #2a2a2a; color: #ffffff; padding: 8px; }"
        "QTableWidget::item { padding: 8px; }"
    );
    bidTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    bidTable->verticalHeader()->setVisible(false);
    bidTable->setFixedHeight(250);  
    

    askTable->setHorizontalHeaderLabels({"Price", "Size"});
    askTable->setStyleSheet(
        "QTableWidget { background-color: #1a1a1a; color: #ffffff; min-width: 300px; }"
        "QHeaderView::section { background-color: #2a2a2a; color: #ffffff; padding: 8px; }"
        "QTableWidget::item { padding: 8px; }"
    );
    askTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    askTable->verticalHeader()->setVisible(false);
    askTable->setFixedHeight(250);  
    

    auto tablesLayout = new QHBoxLayout;
    tablesLayout->addWidget(bidTable);
    tablesLayout->addSpacing(20);  
    tablesLayout->addWidget(askTable);
    orderbookLayout->addLayout(tablesLayout);
    
    orderbookGroup->setLayout(orderbookLayout);
    layout()->addWidget(orderbookGroup);
}

void OutputPanel::updateMetrics(const SimulationOutputs& outputs) {
    slippageLabel->setText(QString("%1%").arg(outputs.expectedSlippage * 100, 0, 'f', 2));
    feesLabel->setText(QString("$%1").arg(outputs.expectedFees, 0, 'f', 2));
    marketImpactLabel->setText(QString("%1%").arg(outputs.expectedMarketImpact * 100, 0, 'f', 2));
    netCostLabel->setText(QString("$%1").arg(outputs.netCost, 0, 'f', 2));
    makerTakerLabel->setText(QString("%1").arg(outputs.makerTakerProportion, 0, 'f', 2));
    latencyLabel->setText(QString("%1 ms").arg(outputs.internalLatency, 0, 'f', 2));
    timestampLabel->setText(outputs.timestamp);
}

void OutputPanel::updateOrderBook(const OrderBook& orderBook) {
    
    for (int i = 0; i < std::min(5, static_cast<int>(orderBook.bids.size())); ++i) {
        const auto& [price, size] = orderBook.bids[i];
        
        auto sizeItem = new QTableWidgetItem(QString::number(size, 'f', 2));
        auto priceItem = new QTableWidgetItem(QString::number(price, 'f', 1));
        
        sizeItem->setTextAlignment(Qt::AlignRight | Qt::AlignVCenter);
        priceItem->setTextAlignment(Qt::AlignRight | Qt::AlignVCenter);
        
        
        sizeItem->setForeground(QColor("#4ade80"));  
        priceItem->setForeground(QColor("#ffffff"));
        
        bidTable->setItem(i, 0, sizeItem);
        bidTable->setItem(i, 1, priceItem);
    }
    
    
    for (int i = 0; i < std::min(5, static_cast<int>(orderBook.asks.size())); ++i) {
        const auto& [price, size] = orderBook.asks[i];
        
        auto priceItem = new QTableWidgetItem(QString::number(price, 'f', 1));
        auto sizeItem = new QTableWidgetItem(QString::number(size, 'f', 2));
        
        priceItem->setTextAlignment(Qt::AlignRight | Qt::AlignVCenter);
        sizeItem->setTextAlignment(Qt::AlignRight | Qt::AlignVCenter);
        
        priceItem->setForeground(QColor("#ffffff"));
        sizeItem->setForeground(QColor("#f87171"));  
        
        askTable->setItem(i, 0, priceItem);
        askTable->setItem(i, 1, sizeItem);
    }
}