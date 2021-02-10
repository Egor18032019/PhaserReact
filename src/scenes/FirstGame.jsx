
import Phaser from 'phaser';
import React, {useState, Component} from 'react';
import {IonPhaser} from '@ion-phaser/react';

import WorldScene from './WorldScene.js';
import PlatformScene from './PlatformScene.js';
import BootScene from './BootScene.js';

const mainGame = {
  type: Phaser.AUTO,
  // backgroundColor: '#555555',
  // parent: 'phaser-example',
  // parent: `content`,
  width: 800,
  height: 600,
  // zoom: 2,
  // pixelArt: true, // чтобы не было размытия текстур при масштабировании
  physics: {
    default: `arcade`,
    arcade: {
      gravity: {y: 300},
      debug: false,
    },
  },
  scene: [
    PlatformScene
  ],
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialize: true,
      game: mainGame
    };
  }
  render() {
    const {initialize, game} = this.state;
    return (
      <IonPhaser game={game} initialize={initialize} />
    );
  }
}

export default FirstGame;
