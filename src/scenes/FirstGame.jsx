
import Phaser from 'phaser';
import React, {useState} from 'react';
import {IonPhaser} from '@ion-phaser/react';

import WorldScene from './WorldScene.js';
import PlatformScene from './PlatformScene.js';
import BootScene from './BootScene.js';
import BattleScene from './BattleScene.js';
import UIScene from './UIScene.js';
import {createTrue} from 'typescript';

const mainGame = {
  type: Phaser.AUTO,
  // backgroundColor: '#555555',
  parent: `game-container`,
  // parent: `content`,
  width: 320,
  height: 240,
  // zoom: 2,
  // pixelArt: true, // чтобы не было размытия текстур при масштабировании
  physics: {
    default: `arcade`,
    arcade: {
      gravity: {y: 0},
      debug: true, // . Phaser.GameObjecfalseone - это невидимый объект, чтобы увидеть его во время разработки, вы можете установить debug: true
    },
  },
  scene: [
    BootScene, WorldScene, BattleScene, UIScene],
};
let gamePhaser = new Phaser.Game(mainGame);

const FirstGame = () => {
  const [gameState] = useState({
    initialize: true,
    game: gamePhaser
  });
  const {initialize, game} = gameState;

  return (
    <div className='game-wrapper'>
      <div className='wrapper'>
        <IonPhaser game={game} initialize={initialize} />
      </div>
    </div>
  );
};

export default FirstGame;
