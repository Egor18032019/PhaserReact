import Phaser from 'phaser';
import dragonblue from "../assets/dragonblue.png"; // понять не могу почему по простому не получаеться
import dragonorrange from "../assets/dragonorrange.png"; // такое впечетление что он их тащит от index.html
import tiles from "../assets/map/spritesheet.png";
import map from "../assets/map/map.json";
import player from "../assets/RPG_assets.png";
import star from '../assets/star.png';

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
    this.load.image(`tiles`, tiles);

    // карта в json формате
    this.load.tilemapTiledJSON(`map`, map);

    // наши персонажи
    this.load.spritesheet(`player`, player, {
      frameWidth: 16,
      frameHeight: 16
    });
    // load resources for Battle and UI
    this.load.image(`dragonblue`, dragonblue);
    this.load.image(`dragonorrange`, dragonorrange);

    this.load.image(`star`, star);
    this.load.image(`red`, `http://labs.phaser.io/assets/particles/red.png`);

    console.log(`BootScene end`);
  }

  create() {

    this.scene.start(`WorldScene`, false);
  }

  update() {
  }
}
