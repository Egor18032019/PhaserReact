
import Phaser from 'phaser';
import React, {useState, Component} from 'react';
import {IonPhaser} from '@ion-phaser/react';

import BootScene from './BootScene.js';
import WorldScene from './WorldScene.js';
import BattleScene from './BattleScene.js';
import UIScene from './UIScene.js';

import {mapGame} from "../utils/NameSpace.js";

const returnConfigMainGame = (configGame) => {
  return (
    {
      type: Phaser.AUTO,
      // backgroundColor: '#555555',
      parent: `Game-container`,
      width: configGame.width,
      height: configGame.height,
      // для PlatformScene 800*600 + гравитация 300
      // zoom: 2,
      pixelArt: true, // чтобы не было размытия текстур при масштабировании
      physics: {
        default: `arcade`,
        arcade: {
          gravity: configGame.gravity,
          debug: false, // . Phaser.GameObject это невидимый объект, чтобы увидеть его во время разработки, вы можете установить debug: true
        },
      },
      scene: configGame.scene
    }
  );
};

class firstGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialize: true,
      // game: new Phaser.Game(mainGame)
      game: new Phaser.Game(mainGame)
    };
  }

  render() {
    const {initialize, game} = this.state;
    console.log(this.props);

    return (
      // new Phaser.Game(mainGame)
      <IonPhaser game={game} initialize={initialize} />

    );
  }
}

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
      gravity: {y: 0},
      debug: false, // . Phaser.GameObjecfalseone - это невидимый объект, чтобы увидеть его во время разработки, вы можете установить debug: true
    },
  },
  scene: [
    BootScene, WorldScene, BattleScene, UIScene],
};

const FirstGame = (props) => {

  const [gameState, setGameState] = useState({
    initialize: true,
    game: mainGame
  });

  return (
    <IonPhaser game={gameState.game} initialize={gameState.initialize} />
  );
};

const chooseGame = (game) => {
  const ChoosingGame = returnConfigMainGame(mapGame[game]);
  const foo = new Phaser.Game(ChoosingGame);
  return (
    foo
  );
};
export default chooseGame;
