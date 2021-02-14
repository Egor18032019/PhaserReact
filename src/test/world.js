let BootScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function BootScene() {
      Phaser.Scene.call(this, {
        key: `BootScene`
      });
    },

  preload() {
    // здесь происходит загрузка ресурсов
    // тайлы для карты
    this.load.image(`tiles`, `assets/map/spritesheet.png`);

    // карта в json формате
    this.load.tilemapTiledJSON(`map`, `assets/map/map.json`);

    // наши два персонажа (я лично увидел 4-х персонажей)
    this.load.spritesheet(`player`, `assets/RPG_assets.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    // враги
    this.load.image(`dragonblue`, `assets/dragonblue.png`);
    this.load.image(`dragonorrange`, `assets/dragonorrange.png`);

  },

  create() {
    // Запускаем сцену мира
    this.scene.start(`WorldScene`);
  }
});

let WorldScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function WorldScene() {
      Phaser.Scene.call(this, {
        key: `WorldScene`
      });
    },
  preload() {

  },
  create() {
    // здесь создается сцена WorldScene
    // создаем карту
    let map = this.make.tilemap({
      key: `map`
    }); // Параметр key  - это имя, каторое мы дали
    // карте, когда использовали this.load.tilemapTiledJSON
    // для ее загрузки.
    // Теперь, если вы обновите игру, она все еще черная. Чтобы карта была в игре, нам нужно загрузить слои карты.
    // первый параметр это название карты тайлов (там где храняться спрайты карты) на карте
    let tiles = map.addTilesetImage(`spritesheet`, `tiles`);

    // создаем слои
    // grass - «Трава»  содержит только элементы травы
    let grass = map.createStaticLayer(`Grass`, tiles, 0, 0);
    // obstacles - «Препятствия» на нем есть несколько деревьев.
    let obstacles = map.createStaticLayer(`Obstacles`, tiles, 0, 0);

    // делает все тайлы в слое obstacles  доступными для обнаружения столкновений (отправляет -1)
    obstacles.setCollisionByExclusion([-1]);


    // анимация клавиши 'left' для персонажа
    // мы используем одни и те же спрайты для левой и правой клавиши, просто зеркалим их
    this.anims.create({
      key: `left`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [1, 7, 1, 13]
      }),
      frameRate: 10,
      repeat: -1
    });

    // анимация клавиши 'right' для персонажа
    this.anims.create({
      key: `right`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [1, 7, 1, 13]
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: `up`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [2, 8, 2, 14]
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: `down`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [0, 6, 0, 12]
      }),
      frameRate: 10,
      repeat: -1
    });

    // создадим наш спрайт игрока через физическую систему phycis
    // Для перемещения по нашей карте мира мы будем использовать физику Phaser 3 Arcade.
    // Чтобы игрок мог столкнуться с препятствиями на карте, мы создадим его с помощью системы физики - this.physics.add.sprite.
    // Первый параметр - координата x, второй - y, третий - ресурс изображения, а последний - его кадр.
    this.player = this.physics.add.sprite(50, 100, `player`, 6);

    // Далее ограничим игрока границами карты. Сначала мы устанавливаем границы мира, а затем устанавливаем
    // для свойства персонажа collideWorldBounds значение true.
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);


    // получаем данные ввода пользователя с клавиатуры
    this.cursors = this.input.keyboard.createCursorKeys();

    // ограничиваем камеру размерами карты
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // заставляем камеру следовать за игроком
    this.cameras.main.startFollow(this.player);
    // своего рода хак, чтобы предотвратить пояление полос в тайлах
    this.cameras.main.roundPixels = true;

    // запрещаем проходить сквозь деревья
    this.physics.add.collider(this.player, obstacles);

    // распологаем врагов
    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Zone
    });
    for (let i = 0; i < 30; i++) {
      let x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      let y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      // параметры: x, y, width, height
      this.spawns.create(x, y, 20, 20);
    }
    // добавляем коллайдер
    this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);

    this.sys.events.on(`wake`, this.wake, this);

  },
  wake() {
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  },
  onMeetEnemy(player, zone) {
    // мы перемещаем зону в другое место
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    // встряхиваем мир
    this.cameras.main.shake(300);
    // this.cameras.main.flash(300);

    // начало боя
    // переключаемся на  BattleScene
    this.scene.switch(`BattleScene`);
  },


  update(time, delta) {
    // Сначала мы устанавливаем скорость тела на 0.
    this.player.body.setVelocity(0);

    // горизонтальное перемещение
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }

    // вертикальное перемещение
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }

    // В конце обновляем анимацию и устанавливаем приоритет анимации
    // left/right над анимацией up/down
    if (this.cursors.left.isDown) {
      this.player.anims.play(`left`, true);
      this.player.flipX = true; // Разворачиваем спрайты персонажа вдоль оси X
    } else if (this.cursors.right.isDown) {
      this.player.anims.play(`right`, true);
      this.player.flipX = false; // Отменяем разворот спрайтов персонажа вдоль оси X
    } else if (this.cursors.up.isDown) {
      this.player.anims.play(`up`, true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play(`down`, true);
    } else {
      this.player.anims.stop();
    }
  }
});
