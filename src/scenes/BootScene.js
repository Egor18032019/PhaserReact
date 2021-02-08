 import Phaser from 'phaser';
// const sky = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAwCAYAAABwrHhvAAACdElEQVRYR8WYzUoDMRDHU9BiK0VBVKQnwaMXBW8+QMGH8CJ4FfQxFLwKXnwIoQ/gQRD0IngRPBVREZRiK35QmZVZZmeTzKSbbXPxY5PML/9M5r/ZytHFxsAUaPubV5UCw02lTICdw/XB6cG1F7A0AAi+smbM/Y0xPggvQL/fN7VaLVUY/oZG/2fbAgyOA30QQQqMBMAWxJdkXAFcffftKx3WmK06tyKnwNgBQo8UVQBX/9Lp5aaZb9atKgTlgA3OBkDlxzGubYgGYNt7DmyDSAH4kdNuBSoAADMLPTM1PeEc+vnxY96f65m6ICqAScnPP0YBAAi+uPyf9RDE1RDu6aGaQkQH0ChXGIBu193lr8HVa4JjH4QQFZAmxS3Afj4YCIoN/SEKAIWEfHBB20wpOoCkGH8eHcCnAATnKkQDwMDwDuBrYM0URF2IXCaFSSgF5lD4jqB+IdECgA9gMbJVRSjH0FQAmoSCOgCrx8AQ1AfAzalwDlAADXApALT4wOp9hkQhoTBFUSC0FCNkEIDLrkO8gKuTAwh9HwQ5QwB4jkQBoGak3Qo0JaiKhXOAvxNqTgItx8EAPBdcl9OTvdagOddIeDqvXbN73LbeEYMB+AptADQ49ndBjB9As2dl9sntS6ifF4VLAYb18ygA/D6vmVT68KCZA/okClAAsNXt26Vk/NnqY24e7ufaQK5+ya0G/Xyr/W3OW5MGfkKD313Nd+cPgcoAhAyMCkBrOKqggaFXLE1/W5/MxVI7CUKOHICrM3IAm59LHyIlVdNjCB2H8XMpgPQ8U4qlMoyTFV01hXJ+x9X6ubRC6bkVIMTPpQDS87ED/AHJMgYVIiGAKwAAAABJRU5ErkJggg=="
import sky from "../assets/player.png"

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({key: 'BootScene'});
  
  }

  preload() {
    console.log(`BootScene`)
    // // console.log(sky)
    // this.load.image('tiles', '../assets/map/spritesheet.png');
    // // this.load.image('tiles', sky);
 
    // // карта в json формате
    // this.load.tilemapTiledJSON('map', '../assets/map/map.json');

    // // наши два персонажа (я лично увидел 4-х персонажей)
    // this.load.spritesheet('player', '../assets/RPG_assets.png', {
    //     frameWidth: 16,
    //     frameHeight: 16
    // });
            // здесь происходит загрузка ресурсов
        // тайлы для карты
        this.load.image('tiles', 'assets/map/spritesheet.png');
        
        // карта в json формате
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');
        
        // наши два персонажа (я лично увидел 4-х персонажей)
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });

    console.log(`BootScene end`)
  }

  create() { 
    console.log(`BootScene create`)

    // this.scene.start('WorldScene');
  }

  update() {
 
  }
}



