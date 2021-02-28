import './App.css';
import React, {useState, useEffect} from 'react';

import chooseGame from "./scenes/FirstGame.jsx";
import {DATAGAMELIST} from "./data/GameList.js";

import {customLi} from "./utils/utils.jsx";

function App() {
  const [game, setGame] = useState(`Xodilka`);

  useEffect(() => {
    chooseGame(game);
  }, [game]);

  const onGameClick = (evt) => {
    setGame(evt);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={`./logo.png`} className="App-logo" alt="logo" />
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
        <article className="Game-container">
          {customLi(DATAGAMELIST, onGameClick)}
        </article>
        {/* <FirstGame
          game={game}
        /> */}
      </main>
    </div>
  );
}

export default App;
