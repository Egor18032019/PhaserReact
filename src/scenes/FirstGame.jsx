
import Phaser from 'phaser';
import React, {useState} from 'react';
import {IonPhaser} from '@ion-phaser/react';

import WorldScene from './WorldScene.js';
import PlatformScene from './PlatformScene.js';
import BootScene from './BootScene.js';
import BattleScene from './BattleScene.js';
import UIScene from './UIScene.js';

const mainGame = {
  type: Phaser.AUTO,
  // backgroundColor: '#555555',
  // parent: 'phaser-example',
  // parent: `content`,
  width: 320,
  height: 240,
  // zoom: 2,
  // pixelArt: true, // чтобы не было размытия текстур при масштабировании
  physics: {
    default: `arcade`,
    arcade: {
      gravity: {y: 300},
      debug: false, // . Phaser.GameObjects.Zone - это невидимый объект, чтобы увидеть его во время разработки, вы можете установить debug: true
    },
  },
  scene: [
    BootScene, BattleScene, UIScene],
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
