import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';
import Home from './pages/Home';
import Department from './pages/Department';
import { Employee } from './pages/Employee';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/department" element={<Department />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;