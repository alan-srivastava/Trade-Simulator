#pragma once

#include <QMainWindow>
#include <QVBoxLayout>
#include "InputPanel.h"
#include "OutputPanel.h"
#include "WebSocketClient.h"
#include "TradeCalculator.h"

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow() = default;

private slots:
    void handleInputChange();
    void handleOrderBookUpdate(const OrderBook& orderBook);

private:
    void setupUI();
    void updateOutputs();

    QWidget* centralWidget;
    QHBoxLayout* mainLayout;
    InputPanel* inputPanel;
    OutputPanel* outputPanel;
    WebSocketClient* wsClient;
    TradeCalculator calculator;
};