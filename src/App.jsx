import logo from '../src/assets/logo.png';
import './App.css';
import React from 'react';

import FirstGame from "./scenes/FirstGame.jsx";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ul className="App-list">
          <li>1.Сделать несколько игр. </li>
          <li>2.Сделать выбор с анимацией. </li>
        </ul>
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
