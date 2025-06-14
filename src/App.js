import React from 'react';
import './App.css';
import EncodeSection from './components/EncodeSection';
import DecodeSection from './components/DecodeSection';

function App() {
  return (
    <div className="App">
      <div className="container">
        <EncodeSection />
        <DecodeSection />
      </div>
    </div>
  );
}

export default App;