import BootScene from '../scenes/BootScene.js';
import WorldScene from '../scenes/WorldScene.js';
import BattleScene from '../scenes/BattleScene.js';
import UIScene from '../scenes/UIScene.js';
import PlatformScene from '../scenes/PlatformScene.js';
import GameScene from '../scenes/GameScene.js';

const mapGame = {
  "Platformer": {
    width: 800,
    height: 600,
    gravity: {
      y: 300
    },
    scene: [
      PlatformScene
    ],
  },
  "Xodilka": {
    width: 300,
    height: 200,
    gravity: {
      y: 0
    },
    scene: [
      BootScene, WorldScene, BattleScene, UIScene
    ],
  },
  "Tenis": {},
  "RPG": {
    width: 640, // ширина игры
    height: 360, // высота игры
    gravity: {
      y: 0
    },
    scene: GameScene
  }
};

export {
  mapGame
};
