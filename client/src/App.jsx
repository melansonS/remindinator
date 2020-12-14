import React from 'react';
import './App.css';

function App() {
  const ping = async () => {
    const response = await fetch('http://localhost:8888');
    const body = await response.text();
    console.log(body);
  };
  ping();

  return (
    <div className="App">
      <header className="App-header">
        <h1> Hello world!</h1>
      </header>
    </div>
  );
}

export default App;
