import Phaser from 'phaser';

let Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
      this.type = type;
      this.maxHp = this.hp = hp;
      this.damage = damage; // урон по умолчанию
      this.living = true;
      this.menuItem = null;
    },

  // мы будем использовать эту функцию, чтобы установить пункт меню, когда юнит умирает
  // Мы свяжем каждый юнит с его пунктом меню, и когда он будет убит, то уведомит об этом пункт меню, поэтому игрок не сможет выбрать убитого врага.
  setMenuItem(item) {
    this.menuItem = item;
  },
  // атака целевого юнита
  attack(target) {
    if (target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit(`Message`, this.type + ` атакует ` + target.type + ` с ` + this.damage + ` уроном`);
    }
  },
  takeDamage(damage) {
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

let Enemy = new Phaser.Class({
  Extends: Unit,

  initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
  }
});

let PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize: function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    // зеркально развернем изображение, чтобы не править его в ручную
    this.flipX = true;

    this.setScale(2);
  }
});

export {
  Enemy,
  PlayerCharacter
};
