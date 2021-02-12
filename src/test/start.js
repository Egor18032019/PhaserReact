var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true, //чтобы не было размытия текстур при масштабировании
    physics: {
        default: 'arcade', //данный режим позволит перемещать персонажа
        arcade: {
            gravity: { y: 0 },
            debug: false // установите в true, чтобы видеть зоны
        }
    },
    scene: [
        BootScene,
        WorldScene,
        BattleScene,
        UIScene
    ]
};
var game = new Phaser.Game(config);
