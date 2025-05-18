cmake_minimum_required(VERSION 3.16)
project(trade_simulator VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 REQUIRED COMPONENTS Core Widgets WebSockets Charts)

add_executable(trade_simulator
    src/main.cpp
    src/MainWindow.cpp
    src/MainWindow.h
    src/WebSocketClient.cpp
    src/WebSocketClient.h
    src/OrderBook.cpp
    src/OrderBook.h
    src/TradeCalculator.cpp
    src/TradeCalculator.h
    src/InputPanel.cpp
    src/InputPanel.h
    src/OutputPanel.cpp
    src/OutputPanel.h
)

target_link_libraries(trade_simulator PRIVATE
    Qt6::Core
    Qt6::Widgets
    Qt6::WebSockets
    Qt6::Charts
)