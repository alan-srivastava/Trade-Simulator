# High-Performance Trade Impact Simulator
![image](https://github.com/user-attachments/assets/989c7550-5966-4ebf-b4b0-07bba82eb75e)


This project is a real-time trade simulator designed to estimate transaction costs and market impact for cryptocurrency trades by leveraging Level 2 order book data from exchanges. It connects to WebSocket endpoints to stream live market data and provides users with insights into potential slippage, fees, and the overall market influence of their simulated trades.

**Live Demo:** [https://luxury-kulfi-57e5d9.netlify.app/](https://luxury-kulfi-57e5d9.netlify.app/)

## Features

* **Real-time Order Book Data:** Connects to WebSocket APIs to receive live Level 2 order book updates from cryptocurrency exchanges (currently configured for OKX).
* **Input Parameter Configuration:** Allows users to specify various trading parameters, including:
    * Exchange (currently fixed to OKX)
    * Trading Pair (e.g., BTC-USDT, ETH-USDT)
    * Order Type (Market or Limit)
    * Trade Quantity (in USD)
    * Expected Market Volatility (%)
    * Fee Tier
* **Transaction Cost Estimation:** Calculates and displays estimations for:
    * **Expected Slippage:** The anticipated difference between the expected price and the execution price.
    * **Expected Fees:** The estimated trading fees based on the user's selected fee tier.
    * **Market Impact:** The potential influence of the trade on the asset's price.
    * **Net Cost:** The total estimated cost of the transaction.
* **Order Book Visualization:** Presents a real-time view of the top 5 bids and asks from the order book, providing insight into market depth.
* **Performance Metrics:** Displays additional metrics such as the estimated maker/taker ratio and internal processing latency.
* **Live Demo:** A live demonstration of the application is available at [https://luxury-kulfi-57e5d9.netlify.app/](https://luxury-kulfi-57e5d9.netlify.app/).

## Architecture

The simulator is built using Qt (C++) and follows a modular architecture:

* **`InputPanel`:** Provides the user interface for inputting simulation parameters.
* **`OutputPanel`:** Displays the calculated metrics and the real-time order book visualization.
* **`WebSocketClient`:** Handles the connection to the WebSocket API, receives raw market data, and parses it into an `OrderBook` structure.
* **`TradeCalculator`:** Contains the core logic for calculating the various trade impact metrics based on the input parameters and the order book data.
* **`OrderBook`:** A simple data structure to hold the Level 2 order book information (timestamp, exchange, symbol, asks, bids).
* **`MainWindow`:** The main application window that orchestrates the interaction between the different components.

## Getting Started

### Prerequisites

* **Qt Development Environment:** You need to have a working Qt development environment set up on your system (including Qt Creator or a similar IDE and the Qt libraries).
* **C++ Compiler:** A C++ compiler compatible with your Qt installation (e.g., g++, MSVC).
* **Git (Optional but Recommended):** For cloning the repository and version control.

### Building the Application

1.  **Clone the Repository (if you have it on GitHub):**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
    cd TradeImpactSimulator
    ```
    (`alan-srivastava/Trade Simulator` with the actual repository URL.)

2.  **Open the Project File:** Open the `TradeSimulator.pro` file in Qt Creator.

3.  **Configure the Build:** Qt Creator should automatically configure a build setup. Ensure you have a suitable kit selected for your system.

4.  **Build the Project:** Go to "Build" > "Build Project" (or press `Ctrl+B` / `Cmd+B`).

### Running the Application

After a successful build, you can run the application from Qt Creator by going to "Debug" > "Start Debugging" or "Build" > "Run" (or the corresponding shortcuts). Alternatively, you can try the live demo linked above. Please note that the live demo might have certain limitations compared to running the application locally.

## Usage

1.  **Input Parameters:** In the "Input Parameters" panel, specify your desired trading scenario:
    * Select the asset pair you are interested in.
    * Choose the order type (Market or Limit).
    * Enter the quantity you wish to trade in USD.
    * Adjust the expected volatility as a percentage.
    * Select your fee tier on the exchange.
    * Note that the "Exchange" is currently fixed to OKX.

2.  **Output Metrics:** The "Output Metrics" panel will display real-time estimations of the potential transaction costs and market impact based on the current order book and your input parameters.

3.  **Order Book:** The "Order Book" panel shows a live snapshot of the top 5 bid and ask prices and their corresponding sizes. Bids (buy orders) are typically displayed in green, and asks (sell orders) in red.

## Contributing

Contributions to this project are welcome. Feel free to submit bug reports, feature requests, or pull requests. Please follow standard coding conventions and provide clear descriptions of your changes.
