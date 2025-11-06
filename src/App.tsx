import React from 'react';
import './App.css';

import Questions from './components/Questions';

function App() {
  return (
    <>
      <div className="app">
        <div className="app-container">
          <header>
            <span>Survey Visualizer Integration</span>
          </header>
          <main>
            <Questions/>
          </main>
          <footer>
            <span>Barbu David-Florian</span>
            <span>JetBrains Survey Visualizer Integration Task</span>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
