import Phaser from 'phaser';
import {
  Message,
  HeroesMenu,
  ActionsMenu,
  EnemiesMenu
} from "../ui/Menus.js";


export default class UIScene extends Phaser.Scene {
  constructor() {
    super({
      key: `UIScene`
    });

  }
  preload() {
    console.log(`preload UIScene`);

  }
  create() {
    console.log(`create UIScene`);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(2, 150, 90, 100);
    this.graphics.fillRect(2, 150, 90, 100);
    this.graphics.strokeRect(95, 150, 90, 100);
    this.graphics.fillRect(95, 150, 90, 100);
    this.graphics.strokeRect(188, 150, 130, 100);
    this.graphics.fillRect(188, 150, 130, 100);

    // основной контейнер для хранения всех меню
    this.menus = this.add.container();
    this.heroesMenu = new HeroesMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemiesMenu = new EnemiesMenu(8, 153, this);
    // текущее выбранное меню
    this.currentMenu = this.actionsMenu;

    // добавление меню в контейнер
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battleScene = this.scene.get(`BattleScene`);

    this.remapHeroes();
    this.remapEnemies();

    this.input.keyboard.on(`keydown`, this.onKeyInput, this);

    this.battleScene.events.on(`PlayerSelect`, this.onPlayerSelect, this);

    this.events.on(`SelectEnemies`, this.onSelectEnemies, this);

    this.events.on(`Enemy`, this.onEnemy, this);

    this.battleScene.nextTurn();

    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);
    console.log(`UIScene end`);

  }
  remapHeroes() {
    let heroes = this.battleScene.heroes;
    this.heroesMenu.remap(heroes);
  }
  remapEnemies() {
    let enemies = this.battleScene.enemies;
    this.enemiesMenu.remap(enemies);
  }
  onKeyInput(event) {
    if (this.currentMenu) {
      if (event.code === `ArrowUp`) {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === `ArrowDown`) {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === `ArrowRight` || event.code === `Shift`) {

      } else if (event.code === `Space` || event.code === `ArrowLeft`) {
        this.currentMenu.confirm();
      }
    }
  }
  onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }
  onSelectEnemies() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }
  onEnemy(index) {
    console.log(`UIScene onEnemy`);

    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection(`attack`, index);
  }
}
