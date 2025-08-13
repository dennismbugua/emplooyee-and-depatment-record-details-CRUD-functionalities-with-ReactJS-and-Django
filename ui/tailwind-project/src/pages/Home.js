import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Active Employees", value: "500+", color: "text-blue-600" },
    { label: "Departments", value: "25+", color: "text-green-600" },
    { label: "System Uptime", value: "99.9%", color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-full text-white/80 text-sm font-medium mb-6">
                ✨ Next-Generation Management Platform
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Employee &
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Department
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Excellence
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-12">
              Transform your organization with our cutting-edge React-based management ecosystem. 
              Experience seamless CRUD operations, real-time analytics, and intuitive workflow automation.
            </p>

            {/* Animated Stats */}
            <div className="flex justify-center items-center space-x-12 mb-16">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    currentStat === index ? 'scale-110' : 'scale-100 opacity-70'
                  }`}
                >
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Department Management Card */}
            <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">Department Management</h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  Orchestrate organizational excellence with intelligent department structuring and dynamic workflow optimization.
                </p>
                <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300">
                  <span>Advanced Features</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Employee Records Card */}
            <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-300 transition-colors">Employee Excellence</h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  Empower your workforce with comprehensive profiles, performance insights, and career development tracking.
                </p>
                <div className="flex items-center text-green-400 text-sm font-medium group-hover:text-green-300">
                  <span>People-First Design</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Real-time Analytics Card */}
            <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">AI-Powered Analytics</h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  Harness machine learning insights with real-time data synchronization and predictive workforce analytics.
                </p>
                <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300">
                  <span>Smart Intelligence</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Navigation */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10 rounded-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                Launch Your
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Workflow</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Link 
                  to="/department" 
                  className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 hover:from-blue-700 hover:to-blue-800 transition-all duration-500 transform hover:scale-105 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform">Departments</h3>
                      <p className="text-blue-100 text-lg">Architect organizational excellence</p>
                      <div className="mt-4 flex items-center text-blue-200 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Active Management</span>
                      </div>
                    </div>
                    <div className="relative">
                      <svg className="w-12 h-12 text-blue-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                    </div>
                  </div>
                </Link>

                <Link 
                  to="/employee" 
                  className="group relative bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8 hover:from-green-700 hover:to-green-800 transition-all duration-500 transform hover:scale-105 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform">Employees</h3>
                      <p className="text-green-100 text-lg">Empower your workforce</p>
                      <div className="mt-4 flex items-center text-green-200 text-sm">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                        <span>People-Centric</span>
                      </div>
                    </div>
                    <div className="relative">
                      <svg className="w-12 h-12 text-green-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Technology Stack */}
          <div className="mt-20 text-center">
            <h3 className="text-3xl font-bold text-white mb-8">
              Powered by
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Innovation</span>
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-12 text-white/80">
              <div className="group flex items-center space-x-3 hover:scale-110 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="font-semibold text-lg group-hover:text-blue-300">React 18</span>
              </div>
              <div className="group flex items-center space-x-3 hover:scale-110 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="font-semibold text-lg group-hover:text-green-300">Django REST</span>
              </div>
              <div className="group flex items-center space-x-3 hover:scale-110 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="font-semibold text-lg group-hover:text-cyan-300">Tailwind CSS</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 border border-white/20">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
              <span className="text-white/80">System Status: All Services Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;