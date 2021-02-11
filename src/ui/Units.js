import Phaser from 'phaser';

let Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
      this.type = type;
      this.maxHp = this.hp = hp;
      this.damage = damage; // урон по умолчанию
    },
  attack(target) {
    target.takeDamage(this.damage);
    // this.scene.events.emit("Message", this.type + " атакует " + target.type + " с " + this.damage + " уроном");
  },
  takeDamage(damage) {
    this.hp -= damage;
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
