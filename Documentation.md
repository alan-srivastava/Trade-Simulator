This document outlines the purpose and key roles of the files and directories within the Project codebase.

Root Directory (/)

main.tsx:

Purpose: Application Entry Point.
Key Roles: Mounts the root React component (<App />) into the Document Object Model (DOM).
App.tsx:

Purpose: Main Layout Component.
Key Roles: Renders the primary user interface structure, likely acting as a container for other components like visualizers and panels.
Source Directory (/src)

components Directory (/src/components): Contains React components responsible for specific UI elements.

Orderbook.cpp:
Purpose: Order Book Visualizer Component.
Likely Props: Order data (bids and asks), visualization settings (e.g., depth levels, styling).
Technologies: React, rendering likely implemented using SVG, Canvas, or div-based structures.
InputPanel.cpp:
Purpose: User Input Form.
Likely Props: Event handlers for form submission, mechanisms for data binding and state management of input fields.
OutputPanel.cpp:
Purpose: Output Display Component.
Likely Props: Data representing trade results, profit/loss calculations, balance changes, or other relevant metrics.
TradeCalculator.cpp:
Purpose: Trade Simulation Controller Component.
Responsibilities: Orchestrates trade simulations based on user inputs, likely interacts with the TradeCalculator service, and updates UI components (charts, outputs) with simulation results.
services Directory (/src/services): Contains modules responsible for backend-like logic and data handling.

TradeCalculator.cpp:
Purpose: Trade Simulation Logic.
Exports: Functions such as calculateTrade(inputData) and simulateOrders(simulationConfig).
Usage: Called by components like TradeSimulator to perform the core computations of trade outcomes.
WebSocketManager.ts:
Purpose: Real-time Data Handling via WebSocket.
Responsibilities:
Establishes and manages connections to exchange or data provider WebSocket APIs.
Handles incoming WebSocket messages.
Parses and distributes real-time data (e.g., order book updates) to relevant components or a global state management system.
hooks Directory (/src/hooks): Contains custom React hooks to encapsulate reusable logic.

Orderbook.h:
Purpose: Custom Hook for Live Order Book State Management.
Returns: Processed order book data suitable for the Orderbook component, along with potential loading and error state indicators.
Uses: Internally utilizes the WebSocketManager to fetch and manage real-time order book updates.
utils Directory (/src/utils): Contains utility functions for common tasks.

formatters.ts:
Purpose: Data Formatting Utilities.
Functions Include: formatCurrency(value: number), formatVolume(volume: number), formatTimestamp(timestamp: Date | number).
types Directory (/src/types): Contains TypeScript interfaces and type aliases defining data structures used throughout the application.

index.html: Note: This file name is unusual for a TypeScript types directory. It likely contains type definitions.
