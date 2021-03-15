import Phaser from 'phaser';

let Message = new Phaser.Class({ // Кричит Message в Units

  Extends: Phaser.GameObjects.Container,

  initialize: function Message(scene, events) {
    Phaser.GameObjects.Container.call(this, scene, 160, 30);
    let graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(-90, -15, 180, 52);
    graphics.fillRect(-90, -15, 180, 52);
    this.text = new Phaser.GameObjects.Text(scene, 0, 12, `Лог`, {
      color: `#ffffff`,
      align: `center`,
      fontSize: 13,
      wordWrap: {
        width: 160,
        useAdvancedWrap: true
      }
    });
    this.add(this.text);
    this.text.setOrigin(0.5);
    // вызываем в Units с помощью команы "Message"
    events.on(`Message`, this.showMessage, this);
    this.visible = false;
  },
  showMessage(text) {
    console.log(text);
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) {
      this.hideEvent.remove(false);
    }

    this.hideEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: this.hideMessage,
      callbackScope: this
    });
  },
  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  }
});

let MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

    function MenuItem(x, y, text, scene) {
      Phaser.GameObjects.Text.call(this, scene, x, y, text, {
        color: `#ffffff`,
        align: `left`,
        fontSize: 15
      });
    },

  select() {
    this.setColor(`#f8ff38`);
  },

  deselect() {
    this.setColor(`#ffffff`);
  },
  // когда связанный враг или игрок убит
  unitKilled() {
    this.active = false;
    this.visible = false;
  }
});

let Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize:

    function Menu(x, y, scene, heroes) {
      Phaser.GameObjects.Container.call(this, scene, x, y);
      this.menuItems = [];
      this.menuItemIndex = 0;
      this.heroes = heroes;
      this.x = x;
      this.y = y;
      this.selected = false;
    },
  addMenuItem(unit) {
    let menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  },
  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0) {
        this.menuItemIndex = this.menuItems.length - 1;
      }
    } // создает цикл, который выполняет указанное выражение до тех пор, пока условие не станет ложным
    while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) {
        this.menuItemIndex = 0;
      }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  // выбрать меню целиком и элемент с индексом в нем
  select(index) {
    if (!index) {
      index = 0;
    }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) { // создает цикл, выполняющий заданную инструкцию, пока истинно проверяемое условие
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) {
        this.menuItemIndex = 0;
      }
      if (this.menuItemIndex === index) {
        return;
      }
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  },
  // отменить выбор этого меню
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  },
  confirm() {
    // что делать, когда игрок подтверждает свой выбор
  },
  clear() {
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  remap(units) {
    this.clear();
    for (let i = 0; i < units.length; i++) {
      if (units[i].hp === 0) {
        // если хп ноль то удаляем в массиве
        // units.splice(i, 1);
        this.units[i].destroy();
      } else {
        let unit = units[i];
        unit.setMenuItem(this.addMenuItem(unit.type));
      }
    }
    this.menuItemIndex = 0;
  }
});

let HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function HeroesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    }
});


let ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function ActionsMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
      this.addMenuItem(`Атака`);
    },
  confirm() {
    //  что делать, когда игрок выберет действие
    this.scene.events.emit(`SelectedAction`);
  }

});

let EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function EnemiesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
  confirm() {
    // что делать, когда игрок выберет врага
    this.scene.events.emit(`Enemy`, this.menuItemIndex);
  }
});

export {
  Message,
  HeroesMenu,
  ActionsMenu,
  EnemiesMenu
};
