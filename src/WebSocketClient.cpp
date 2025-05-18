#include "WebSocketClient.h"
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>

WebSocketClient::WebSocketClient(QObject *parent)
    : QObject(parent)
{
    connect(&webSocket, &QWebSocket::connected,
            this, &WebSocketClient::onConnected);
    connect(&webSocket, &QWebSocket::disconnected,
            this, &WebSocketClient::onDisconnected);
    connect(&webSocket, &QWebSocket::textMessageReceived,
            this, &WebSocketClient::onMessageReceived);
}

void WebSocketClient::connectToHost() {
    webSocket.open(QUrl(WS_URL));
}

void WebSocketClient::onConnected() {
    emit connected();
}

void WebSocketClient::onDisconnected() {
    emit disconnected();
}

void WebSocketClient::onMessageReceived(const QString& message) {
    QJsonDocument doc = QJsonDocument::fromJson(message.toUtf8());
    QJsonObject obj = doc.object();
    
    OrderBook orderBook;
    orderBook.timestamp = obj["timestamp"].toString();
    orderBook.exchange = obj["exchange"].toString();
    orderBook.symbol = obj["symbol"].toString();
    
    auto asks = obj["asks"].toArray();
    auto bids = obj["bids"].toArray();
    
    for (const auto& ask : asks) {
        auto level = ask.toArray();
        orderBook.asks.emplace_back(
            level[0].toString().toDouble(),
            level[1].toString().toDouble()
        );
    }
    
    for (const auto& bid : bids) {
        auto level = bid.toArray();
        orderBook.bids.emplace_back(
            level[0].toString().toDouble(),
            level[1].toString().toDouble()
        );
    }
    
    emit orderBookUpdated(orderBook);
}