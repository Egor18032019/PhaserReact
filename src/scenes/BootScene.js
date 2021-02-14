import Phaser from 'phaser';
import dragonblue from "../assets/dragonblue.png"; // понять не могу почему поп простому не получаеться
import dragonorrange from "../assets/dragonorrange.png";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: `BootScene`
    });

  }

  preload() {
    console.log(`BootScene`);
    // здесь происходит загрузка ресурсов
    // тайлы для карты
    this.load.image(`tiles`, `assets/map/spritesheet.png`);

    // карта в json формате
    this.load.tilemapTiledJSON(`map`, `assets/map/map.json`);

    // наши персонажи
    this.load.spritesheet(`player`, `assets/RPG_assets.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    // load resources for Battle and UI
    this.load.image(`dragonblue`, dragonblue);
    this.load.image(`dragonorrange`, dragonorrange);
    console.log(`BootScene end`);
  }

  create() {
    console.log(`BootScene create`);

    this.scene.start(`WorldScene`, false);
  }

  update() {
    console.log(`BootScene update`);

  }
}
