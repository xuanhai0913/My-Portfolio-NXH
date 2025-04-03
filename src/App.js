import React from 'react';
import Header from './components/Header';
import About from './components/About';
import Profile from './components/Profile';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Header />
      <main className="main-content">
        <Profile />
        <About />
        <Contact />
      </main>
    </div>
  );
}

export default App;