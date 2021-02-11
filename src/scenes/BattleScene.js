import Phaser from 'phaser';
import {
  Enemy,
  PlayerCharacter
} from "../ui/Units.js";


export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({
      key: `BattleScene`
    });

  }

  preload() {
    console.log(`BattleScene`);
  }

  create() {
    // меняем фон на зеленый
    this.cameras.main.setBackgroundColor(`rgba(0, 200, 0, 0.5)`);

    // персонаж игрока - warrior (воин)
    let warrior = new PlayerCharacter(this, 250, 50, `player`, 1, `Воин`, 100, 20);
    this.add.existing(warrior);

    // персонаж игрока - mage (маг)
    let mage = new PlayerCharacter(this, 250, 100, `player`, 4, `Маг`, 80, 8);
    this.add.existing(mage);

    let dragonblue = new Enemy(this, 50, 50, `dragonblue`, null, `Дракон`, 50, 3);
    this.add.existing(dragonblue);

    let dragonOrange = new Enemy(this, 50, 100, `dragonorrange`, null, `Дракон2`, 50, 3);
    this.add.existing(dragonOrange);

    // массив с героями
    this.heroes = [warrior, mage];
    // массив с врагами
    this.enemies = [dragonblue, dragonOrange];
    // массив с обеими сторонами, которые будут атаковать
    this.units = this.heroes.concat(this.enemies);
    // Одновременно запускаем сцену UI Scene
    this.scene.launch(`UIScene`, true); // обе сцены активны одновременно

    this.index = -1;
  }
  nextTurn() {
    this.index++;
    // если юнитов больше нет, то начинаем сначала с первого
    if (this.index >= this.units.length) {
      this.index = 0;
    }
    if (this.units[this.index]) {
      // если это герой игрока
      if (this.units[this.index] instanceof PlayerCharacter) {
        this.events.emit(`PlayerSelect`, this.index);
      } else { // иначе если это юнит врага
        // выбираем случайного героя
        let r = Math.floor(Math.random() * this.heroes.length);
        // и вызываем функцию атаки юнита врага
        this.units[this.index].attack(this.heroes[r]);
        // добавляем задержку на следующий ход, чтобы был плавный игровой процесс
        this.time.addEvent({
          delay: 3000,
          callback: this.nextTurn,
          callbackScope: this
        });
      }
    }
  }
  receivePlayerSelection(action, target) {
    if (action === `attack`) {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({
      delay: 3000,
      callback: this.nextTurn,
      callbackScope: this
    });
  }

  update() {
    console.log(`BattleScene update`);

  }
}
