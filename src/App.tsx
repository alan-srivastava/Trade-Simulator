/*import React from 'react';
import { Terminal } from 'lucide-react';
import TradeSimulator from './components/TradeSimulator';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-700 p-4">
        <div className="container mx-auto flex items-center">
          <Terminal className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-xl font-semibold">Trade Impact Simulator</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <TradeSimulator />
      </main>
      
      <footer className="border-t border-slate-700 p-4 mt-8">
        <div className="container mx-auto text-sm text-slate-500 text-center">
          High-Performance Trade Simulator &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default App;*/

import React from 'react';
import { Terminal } from 'lucide-react';
import TradeSimulator from './components/TradeSimulator';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800/50 p-4 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto flex items-center max-w-7xl">
          <Terminal className="h-6 w-6 text-blue-400 mr-2" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Trade Impact Simulator
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 max-w-7xl">
        <TradeSimulator />
      </main>
      
      <footer className="border-t border-slate-800/50 p-4 mt-8">
        <div className="container mx-auto text-sm text-slate-400/80 text-center max-w-7xl">
          <p>High-Performance Trade Simulator &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-1 text-slate-500/60">Powered by React and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;