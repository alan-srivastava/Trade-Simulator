#include "MainWindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , wsClient(new WebSocketClient(this))
    , calculator()
{
    setupUI();
    
    connect(wsClient, &WebSocketClient::orderBookUpdated,
            this, &MainWindow::handleOrderBookUpdate);
    
    connect(inputPanel, &InputPanel::inputChanged,
            this, &MainWindow::handleInputChange);
            
    wsClient->connectToHost();
}

void MainWindow::setupUI() {
    centralWidget = new QWidget(this);
    setCentralWidget(centralWidget);
    
    mainLayout = new QHBoxLayout(centralWidget);
    
    inputPanel = new InputPanel(this);
    outputPanel = new OutputPanel(this);
    
    mainLayout->addWidget(inputPanel);
    mainLayout->addWidget(outputPanel);
    
    setWindowTitle("Trade Impact Simulator");
    resize(1200, 800);
}

void MainWindow::handleInputChange() {
    updateOutputs();
}

void MainWindow::handleOrderBookUpdate(const OrderBook& orderBook) {
    updateOutputs();
}

void MainWindow::updateOutputs() {
    auto inputs = inputPanel->getInputs();
    auto metrics = calculator.calculateMetrics(inputs);
    outputPanel->updateMetrics(metrics);
}