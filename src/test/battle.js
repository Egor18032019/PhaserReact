var BattleScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function BattleScene() {
      Phaser.Scene.call(this, {
        key: 'BattleScene'
      });
    },
  create: function () {

    // меняем фон на зеленый
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

    this.startBattle();
    // вешаем на событие wake вызов метода startBattle
    this.sys.events.on('wake', this.startBattle, this);
  },
  startBattle: function () {
    // персонаж игрока - warrior (воин)
    var warrior = new PlayerCharacter(this, 250, 50, 'player', 1, 'Воин', 100, 20);
    this.add.existing(warrior);

    // персонаж игрока - mage (маг)
    var mage = new PlayerCharacter(this, 250, 100, 'player', 4, 'Маг', 80, 8);
    this.add.existing(mage);

    var dragonblue = new Enemy(this, 50, 50, 'dragonblue', null, 'Дракон', 50, 3);
    this.add.existing(dragonblue);

    var dragonOrange = new Enemy(this, 50, 100, 'dragonorrange', null, 'Дракон2', 50, 3);
    this.add.existing(dragonOrange);

    // массив с героями
    this.heroes = [warrior, mage];
    // массив с врагами
    this.enemies = [dragonblue, dragonOrange];
    // массив с обеими сторонами, которые будут атаковать
    this.units = this.heroes.concat(this.enemies);

    // Одновременно запускаем сцену UI Scene
    this.scene.launch('UIScene');

    this.index = -1; // текущий активный юнит
  },

  nextTurn: function () {
    //проверяем не настал ли уже проигрыш или победа
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
    } while (!this.units[this.index].living);

    // если это герой игрока
    if (this.units[this.index] instanceof PlayerCharacter) {
      this.events.emit("PlayerSelect", this.index);
    } else { // иначе если это юнит врага
      // выбираем случайного героя
      var r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living)
      // и вызываем функцию атаки юнита врага
      this.units[this.index].attack(this.heroes[r]);
      // добавляем задержку на следующий ход, чтобы был плавный игровой процесс
      this.time.addEvent({
        delay: 3000,
        callback: this.nextTurn,
        callbackScope: this
      });
    }
  },

  //проверка на проигрыш или победу
  checkEndBattle: function () {
    var victory = true;
    // если все враги умерли - мы победили
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living)
        victory = false;
    }
    var gameOver = true;
    // если все герои умерли - мы проиграли
    for (var i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].living)
        gameOver = false;
    }
    return victory || gameOver;
  },
  endBattle: function () {
    // очищаем состояния, удаляем спрайты
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (var i = 0; i < this.units.length; i++) {
      // ссылки на экземпляры юнитов
      this.units[i].destroy();
    }
    this.units.length = 0;
    // скрываем UI
    this.scene.sleep('UIScene');
    // возвращаемся в WorldScene и скрываем BattleScene
    this.scene.switch('WorldScene');
  },
  receivePlayerSelection: function (action, target) {
    if (action == 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({
      delay: 3000,
      callback: this.nextTurn,
      callbackScope: this
    });
  },

});

var Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
      this.type = type;
      this.maxHp = this.hp = hp;
      this.damage = damage; // урон по умолчанию
      this.living = true;
      this.menuItem = null;
    },

  // мы будем использовать эту функцию, чтобы установить пункт меню, когда юнит умирает
  setMenuItem: function (item) {
    this.menuItem = item;
  },
  // атака целевого юнита
  attack: function (target) {
    if (target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit("Message", this.type + " атакует " + target.type + " с " + this.damage + " уроном");
    }
  },
  takeDamage: function (damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  }
});

var Enemy = new Phaser.Class({
  Extends: Unit,

  initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
  }
});

var PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize: function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    // зеркально развернем изображение, чтобы не править его в ручную
    this.flipX = true;

    this.setScale(2);
  }
});

var UIScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function UIScene() {
      Phaser.Scene.call(this, {
        key: 'UIScene'
      });
    },

  create: function () {
    // рисуем фон для меню
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

    this.battleScene = this.scene.get("BattleScene");

    // слушаем события от клавиатуры
    this.input.keyboard.on("keydown", this.onKeyInput, this);

    // когда наступает ход игрока
    this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);

    // когда выбрано действие в меню
    // на данный момент у нас есть только одно действие, поэтому мы не отправляем id действия
    this.events.on("SelectedAction", this.onSelectedAction, this);

    // когда выбран враг
    this.events.on("Enemy", this.onEnemy, this);

    // когда сцена получает событие wake
    this.sys.events.on('wake', this.createMenu, this);

    // сообщение, описывающее текущее действие
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.createMenu();
  },
  createMenu: function () {
    // перестроение пунктов меню для героев
    this.remapHeroes();
    // перестроение пунктов меню для врагов
    this.remapEnemies();
    // первый шаг
    this.battleScene.nextTurn();
  },
  remapHeroes: function () {
    var heroes = this.battleScene.heroes;
    this.heroesMenu.remap(heroes);
  },
  remapEnemies: function () {
    var enemies = this.battleScene.enemies;
    this.enemiesMenu.remap(enemies);
  },
  onKeyInput: function (event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === "ArrowUp") {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === "ArrowDown") {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === "ArrowRight" || event.code === "Shift") {

      } else if (event.code === "Space" || event.code === "ArrowLeft") {
        this.currentMenu.confirm();
      }
    }
  },
  onPlayerSelect: function (id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  },
  onSelectedAction: function () {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  },
  onEnemy: function (index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  },
});

var MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

    function MenuItem(x, y, text, scene) {
      Phaser.GameObjects.Text.call(this, scene, x, y, text, {
        color: '#ffffff',
        align: 'left',
        fontSize: 15
      });
    },

  select: function () {
    this.setColor('#f8ff38');
  },

  deselect: function () {
    this.setColor('#ffffff');
  },
  // когда связанный враг или игрок убит
  unitKilled: function () {
    this.active = false;
    this.visible = false;
  }

});


var Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize:

    function Menu(x, y, scene, heroes) {
      Phaser.GameObjects.Container.call(this, scene, x, y);
      this.menuItems = [];
      this.menuItemIndex = 0;
      this.x = x;
      this.y = y;
      this.selected = false;
    },
  addMenuItem: function (unit) {
    var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  },
  // навигация по меню
  moveSelectionUp: function () {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0)
        this.menuItemIndex = this.menuItems.length - 1;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown: function () {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length)
        this.menuItemIndex = 0;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  // выбрать меню целиком и подсветить текущий элемент
  select: function (index) {
    if (!index)
      index = 0;
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length)
        this.menuItemIndex = 0;
      if (this.menuItemIndex == index)
        return;
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  },
  // отменить выбор этого меню
  deselect: function () {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  },
  confirm: function () {
    // что делать, когда игрок подтверждает свой выбор
  },
  // очищаем меню и удаляем все пункты
  clear: function () {
    for (var i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  // пересоздаем пункты меню
  remap: function (units) {
    this.clear();
    for (var i = 0; i < units.length; i++) {
      var unit = units[i];
      unit.setMenuItem(this.addMenuItem(unit.type));
    }
    this.menuItemIndex = 0;
  }
});

var HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function HeroesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    }
});


var ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function ActionsMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
      this.addMenuItem('Атака');
    },
  confirm: function () {
    //  что делать, когда игрок выберет действие
    this.scene.events.emit('SelectedAction');
  }

});

var EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function EnemiesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
  confirm: function () {
    // что делать, когда игрок выберет врага
    this.scene.events.emit("Enemy", this.menuItemIndex);
  }
});

var Message = new Phaser.Class({

  Extends: Phaser.GameObjects.Container,

  initialize: function Message(scene, events) {
    Phaser.GameObjects.Container.call(this, scene, 160, 30);
    var graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(-90, -15, 180, 30);
    graphics.fillRect(-90, -15, 180, 30);
    this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", {
      color: '#ffffff',
      align: 'center',
      fontSize: 13,
      wordWrap: {
        width: 160,
        useAdvancedWrap: true
      }
    });
    this.add(this.text);
    this.text.setOrigin(0.5);
    events.on("Message", this.showMessage, this);
    this.visible = false;
  },
  showMessage: function (text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent)
      this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: this.hideMessage,
      callbackScope: this
    });
  },
  hideMessage: function () {
    this.hideEvent = null;
    this.visible = false;
  }
});
