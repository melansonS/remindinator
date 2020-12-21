import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import './App.css';
import Container from './Container';

function App() {
  return (
    <Router>
      <div className="App">
        <Container />
      </div>
    </Router>
  );
}

export default App;
