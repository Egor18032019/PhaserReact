
import Phaser from 'phaser';
import React, {useState, PureComponent} from 'react';
import {IonPhaser} from '@ion-phaser/react';

import BootScene from './BootScene.js';
import WorldScene from './WorldScene.js';
import BattleScene from './BattleScene.js';
import UIScene from './UIScene.js';

import {mapGame} from "../utils/NameSpace.js";

const returnConfigMainGame = (configGame = `Xodilka`) => {
  console.log(`returnConfigMainGame`);

  return (
    {
      type: Phaser.AUTO,
      // backgroundColor: '#555555',
      parent: `content`,
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

class ChooseGame extends PureComponent {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    console.log(`componentDidMount`);
    const ChoosingGame = returnConfigMainGame(mapGame[this.props.game]);
    new Phaser.Game(ChoosingGame);

  }
  componentWillUnmount() {
    console.log(`componentWillUnmount`);

  }

  componentDidUpdate(prevProps) {
    console.log(`componentDidUpdate`);

    let oldCanvas = document.getElementById(`content`);
    console.log(oldCanvas);
    oldCanvas.removeChild(oldCanvas.lastChild);
    const ChoosingGame = returnConfigMainGame(mapGame[this.props.game]);
    new Phaser.Game(ChoosingGame);
  }
  render() {

    return (
      // <IonPhaser game={game} initialize={initialize} />
      <div className="content-info"></div>
    );
  }
}

const mainGame = {
  type: Phaser.AUTO,
  parent: `content`,
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

// const FirstGame = (props) => {

//   const [gameState, setGameState] = useState({
//     initialize: true,
//     game: mainGame
//   });

//   return (
//     <IonPhaser game={gameState.game} initialize={gameState.initialize} />
//   );
// };

const chooseGame = (game) => {
  const ChoosingGame = returnConfigMainGame(mapGame[game]);
  new Phaser.Game(ChoosingGame);
};
export default ChooseGame;
