import "./App.css";
import Home from "./Home";
import Department from "./Department";
import { Employee } from "./Employee";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <Router>
      <div className="App container">
        <h3 className="text-center my-4">
          Welcome to Employee Management System
        </h3>

        <nav className="navbar navbar-expand-sm bg-light navbar-light">
          <button className="navbar-toggler" onClick={toggleNav}>
            ☰
          </button>
          <div className={`navbar-nav ${isNavOpen ? "show" : ""}`}>
            <div className="dropdown">
              <button
                className="btn btn-light btn-outline-primary dropdown-toggle"
                onClick={toggleNav}
              >
                Menu
              </button>
              <div className={`dropdown-menu ${isNavOpen ? "show" : ""}`}>
                <NavLink
                  className="dropdown-item"
                  to="/"
                  onClick={() => setIsNavOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  className="dropdown-item"
                  to="/department"
                  onClick={() => setIsNavOpen(false)}
                >
                  Department
                </NavLink>
                <NavLink
                  className="dropdown-item"
                  to="/employee"
                  onClick={() => setIsNavOpen(false)}
                >
                  Employee
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/department" element={<Department />} />
          <Route path="/employee" element={<Employee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
