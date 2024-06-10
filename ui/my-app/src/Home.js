import React from 'react';
import './index.css';

const Home = () => {
  return (
    <div className="home-container">
      
      <div className="home-content">
        <p>
          This is the home page of our React application. Here, you can find
          various resources and links to other sections of the app. Explore the
          navigation menu to visit the Departments and Employees sections.
        </p>
        <p>
          Our application is built using React, a popular JavaScript library for
          building user interfaces. We have implemented various features to
          provide a seamless experience for managing departments and employees.
        </p>
        <p>
          Below are some quick links to get you started:
        </p>
        <ul className="quick-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/department">Departments</a></li>
          <li><a href="/employee">Employees</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
