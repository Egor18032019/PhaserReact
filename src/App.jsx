import logo from '../src/assets/logo.png';
import './App.css';
import React from 'react';

import FirstGame from "./scenes/FirstGame.jsx";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Phaser
        </a>
      </header>
      <main>
        <FirstGame />
      </main>
    </div>
  );
}

export default App;
