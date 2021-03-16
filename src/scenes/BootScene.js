import Phaser from 'phaser';

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
    this.load.image(`tiles`, `./assets/map/spritesheet.png`);

    // карта в json формате
    this.load.tilemapTiledJSON(`map`, `./assets/map/map.json`);

    // наши персонажи
    this.load.spritesheet(`player`, `./assets/RPG_assets.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    // load resources for Battle and UI
    this.load.image(`dragonblue`, `./assets/dragonblue.png`);
    this.load.image(`dragonorrange`, `./assets/dragonorrange.png`);
    this.load.image(`star`, `./assets/star.png`);
    this.load.image(`red`, `http://labs.phaser.io/assets/particles/red.png`);
  }

  create() {
    this.scene.start(`WorldScene`, false);
  }

  update() {}
}
