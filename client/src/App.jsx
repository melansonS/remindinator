import React, { useEffect } from 'react';
import './App.css';

function App() {
  const ping = async () => {
    const response = await fetch('http://localhost:8888');
    const body = await response.json();
    if (body.success) {
      console.log(body.users);
    } else {
      console.log('Error');
    }
  };
  useEffect(() => {
    ping();
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1> Hello world!</h1>
      </header>
    </div>
  );
}

export default App;
