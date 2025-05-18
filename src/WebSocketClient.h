#pragma once

#include <QObject>
#include <QWebSocket>
#include "OrderBook.h"

class WebSocketClient : public QObject {
    Q_OBJECT

public:
    explicit WebSocketClient(QObject *parent = nullptr);
    void connectToHost();

signals:
    void orderBookUpdated(const OrderBook& orderBook);
    void connected();
    void disconnected();

private slots:
    void onConnected();
    void onDisconnected();
    void onMessageReceived(const QString& message);

private:
    QWebSocket webSocket;
    static constexpr const char* WS_URL = "wss://ws.gomarket-cpp.goquant.io/ws/l2-orderbook/okx/BTC-USDT-SWAP";
};