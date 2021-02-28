import Phaser from 'phaser';
import {
  Enemy,
  PlayerCharacter
} from "../ui/Units.js";
import {
  Message,
} from "../ui/Menus.js";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({
      key: `BattleScene`
    });
    this.warrior = `wasReborn`;
    this.mage = `wasReborn`;
  }

  init(msg) {
    console.log(`BattleScene init: `, msg);
  }

  preload() {}

  startBattle() {
    console.log(`startBattle BS`);

    // персонаж игрока - this.warrior (воин)
    if (this.warrior === `wasReborn`) {
      console.log(`this.warrior wasReborn`);
      this.warrior = new PlayerCharacter(this, 250, 50, `player`, 1, `Воин`, 50, 11);
    }
    this.add.existing(this.warrior);
    // персонаж игрока - mage (маг)
    if (this.mage === `wasReborn`) {
      console.log(`this.mage wasReborn`);
      this.mage = new PlayerCharacter(this, 250, 100, `player`, 4, `Маг`, 50, 11);
    }
    this.add.existing(this.mage);

    // создаем противников
    let dragonblue = new Enemy(this, 50, 50, `dragonblue`, null, `Дракон`, 22, 22);
    this.add.existing(dragonblue);
    let dragonOrange = new Enemy(this, 50, 100, `dragonorrange`, null, `Дракон2`, 22, 22);
    this.add.existing(dragonOrange);

    // массив с героями
    this.heroes = [this.warrior, this.mage];
    // массив с врагами
    this.enemies = [dragonblue, dragonOrange];
    // массив с обеими сторонами, которые будут атаковать
    this.units = this.heroes.concat(this.enemies);
    // проверяем на всякий случай
    for (let i = 0; i < this.units.length; i++) {
      console.log(this.units[i].hp);
      if (this.units[i].hp === 0) {
        // если хп ноль то удаляем в массиве
        // this.units.splice(i, 1);
        this.units[i].destroy();

      }
    }
    // Одновременно запускаем сцену UI Scene
    this.scene.launch(`UIScene`);

    this.index = -1; // текущий активный юнит
  }
  create() {
    // меняем фон на зеленый
    this.cameras.main.setBackgroundColor(`rgba(0, 200, 0, 0.5)`);
    this.startBattle();
    // вешаем на событие wake вызов метода startBattle
    this.sys.events.on(`wake`, this.startBattle, this);
  }

  nextTurn() {
    // проверяем не настал ли уже проигрыш или победа
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      this.index++;
      // если юнитов больше нет, то начинаем сначала с первого
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    }
    while (!this.units[this.index].living);

    // если это герой игрока
    if (this.units[this.index] instanceof PlayerCharacter) {
      this.events.emit(`PlayerSelect`, this.index);
    } else { // иначе если это юнит врага
      // выбираем случайного героя
      let r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);
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
  // проверка на проигрыш или победу
  checkEndBattle() {
    this.victory = true;
    // если все враги умерли - мы победили
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) {
        this.victory = false;
      }
    }
    this.gameOver = true;
    // если все герои умерли - мы проиграли
    for (let j = 0; j < this.heroes.length; j++) {
      if (this.heroes[j].living) {
        this.gameOver = false;
      }
    }

    return this.victory || this.gameOver;
  }

  endBattle() {
    console.log(`endBattle`);
    // очищаем состояния, удаляем спрайты
    this.units.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      // ссылки на экземпляры юнитов
      this.units[i].destroy();
    }
    // скрываем UI
    this.scene.sleep(`UIScene`, `sleep in Battle`);

    if (this.gameOver) {
      console.log(`gameOver `);
      this.heroes.length = 0;

      this.time.addEvent({
        delay: 2000,
        callback: this.endBatleForLose,
        callbackScope: this
      });

    } else {
      // очищаем состояния, удаляем спрайты врагов
      this.enemies.length = 0;
      // возвращаемся в WorldScene и скрываем BattleScene
      this.scene.switch(`WorldScene`);
    }
  }

  endBatleForLose() {
    console.log(`Проигрыш`);
    this.heroes.length = 0;
    this.enemies.length = 0;
    this.warrior = `wasReborn`;
    this.mage = `wasReborn`;
    this.units.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      // ссылки на экземпляры юнитов
      this.units[i].destroy();
    }
    this.createButtonPlay(`star`, `Play ?`);
  }

  createButtonPlay(icon, textButton) {
    let starMouse = this.add.sprite(100, 99, icon);
    starMouse.setVisible(false);

    let playButton =
      this.add.text(111, 75, textButton, {
        font: `18px monospace`,
        color: `white`
      }).setShadow(5, 5, `#5588EE`, 0, true, true);
    playButton.setScale(3).setResolution(5);
    playButton.setInteractive();

    playButton.on(`pointerover`, () => {
      starMouse.setVisible(true);
    });

    playButton.on(`pointerout`, () => {
      starMouse.setVisible(false);
    });

    playButton.on(`pointerup`, () => {
      console.log(`Start Game`);
      // this.scene.remove(`UIScene`, `destroy in Battle`);
      this.scene.start(`WorldScene`, `BattleScene -> WorldScene`);
    });
  }

  update() {}
}
