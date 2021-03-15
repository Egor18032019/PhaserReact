import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: `Game`
    });
    this.playerSpeed = 1.5;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;
  }

  init(msg) {
    console.log(`UIScene Menu: `, msg);
    // сделать анимимацию ходьбы + после взятие сундука увеличивать кол-во драконов
  }

  preload() {
    // загрузка изображений
    this.load.image(`background`, `assets/background.png`);
    this.load.image(`player`, `assets/player.png`);
    this.load.image(`dragon`, `assets/dragon.png`);
    this.load.image(`treasure`, `assets/treasure.png`);
  }

  // выполняется один раз, после загрузки ресурсов
  create() {
    // фон
    let bg = this.add.sprite(0, 0, `background`);

    // перемещаем начальную точку в верхний левый угол
    bg.setOrigin(0, 0);

    // игрок
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, `player`);

    // уменьшить масштаб
    this.player.setScale(0.5);

    // место назначения
    this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, `treasure`);
    this.treasure.setScale(0.6);

    // группа врагов
    this.enemies = this.add.group({
      key: `dragon`,
      repeat: 0, // 5
      setXY: {
        x: 110,
        y: 100,
        stepX: 80,
        stepY: 20
      }
    });

    // масштабируем врагов
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5); // Метод getChildren возвращает нам массив со всеми спрайтами, которые принадлежат группе.

    // задаем скорость врагов
    // Метод Phaser.Actions.Call позволяет нам вызывать анонимную функцию для каждого элемента массива.
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
      enemy.speed = Math.random() * 2 + 1;
    }, this);

    // флаг, что игрок жив
    this.isPlayerAlive = true;

    // сброс эффектов камеры
    this.cameras.main.resetFX();
  }
  // выполняется каждый кадр (ориентировочно 60 раз в секунду)
  update() {
    // выполняем код, если игрок жив
    if (!this.isPlayerAlive) {
      return;
    }

    // проверяем активный ввод
    if (this.input.activePointer.isDown) {

      // игрок перемещается вперед
      this.player.x += this.playerSpeed;
    }

    // проверка на столкновение с сокровищем
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
      this.gameOver();
    }

    // движение врагов
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {

      // перемещаем каждого из врагов
      enemies[i].y += enemies[i].speed;

      // разворачиваем движение, если враг достиг границы
      if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
        enemies[i].speed *= -1;
      } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
        enemies[i].speed *= -1;
      }

      // столкновение с врагами
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
        this.gameOver();
        break;
      }
    }

  }

  gameOver() {
    // устанавливаем флаг, что игрок умер
    this.isPlayerAlive = false;

    // дрожание камеры
    this.cameras.main.shake(500);

    // затухание камеры через 250мс
    this.time.delayedCall(250, function () {
      this.cameras.main.fade(250);
    }, [], this);

    // перезапускаем сцену через 500мс
    this.time.delayedCall(500, function () {
      this.scene.restart();
    }, [], this);
  }

}
