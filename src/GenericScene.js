import Player from './Player.js';
import Board from './Board.js';
import TurnManager from './TurnManager.js';

export default class GenericScene extends Phaser.Scene
{
    constructor (key)
    {
        super(key);

        this.sceneName = key;
        this.mapName = key + '_map';
        this.currentLevel;
        this.player;
        this.board;
        this.map;
    }

    init (data) {
        this.loader = data.loader;
        this.tileFilename = data.tiles;
        this.mapFilename = data.map;
    }

    preload () {
        // this.load.setBaseURL('http://localhost:8000');
        this.load.spritesheet('player-idle', 'assets/sprites/spr_idle_strip9.png',
          { frameWidth: 96, frameHeight: 64 }
        );
        this.load.spritesheet('player-walk', 'assets/sprites/spr_walking_strip8.png',
          { frameWidth: 96, frameHeight: 64 }
        );

        this.load.image('tiles', 'assets/sprites/' + this.tileFilename);
        this.load.tilemapTiledJSON(this.mapName, 'assets/sprites/' + this.mapFilename);
    }

    onWin() {
        let winText = this.add.text(10, 54, 'Parabéns!', { font: '56px Courier', fill: '#333333' });
        winText.setScale(0.25);
        let clickText = this.add.text(10, 70, 'clique para ir para o próximo nível', { font: '24px Courier', fill: '#333333' });
        clickText.setScale(0.25);
        this.input.once('pointerdown', function () {
            this.loader.nextScene();
        }, this);
    }

    create () {
        const board = new Board(this, 16,16);
        this.board = board;

        const map = this.make.tilemap({ key: this.mapName });
        this.map = map;
        const tileset = map.addTilesetImage("world-tileset", "tiles");
        map.createLayer("ground", tileset, 0, 0);
        map.createLayer("above-ground", tileset, 0, 0);
        const worldLayer = map.createLayer("world", tileset, 0, 0);
        // worldLayer.setCollisionByProperty({ collides: true });

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // worldLayer.renderDebug(debugGraphics, {
        //   tileColor: null, // Color of non-colliding tiles
        //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });

        const camera = this.cameras.main;
        camera.setBounds(0, -8, map.widthInPixels, map.heightInPixels);
        camera.setZoom(5);
        camera.setPosition(0, 0);

        const spawnPoint = map.findObject("objects", obj => obj.name === "player_spawn");
        const indexSpawnPoint = board.pixel_to_index(spawnPoint);
        const player = new Player(this, indexSpawnPoint.x, indexSpawnPoint.y);
        // const player = new Player(this, 16, 73);
        this.player = player;
        globalThis.player = player;
        this.add.existing(player);

        const finishArea = map.findObject("objects", obj => obj.name === "finish_area");
        const turnManager = new TurnManager(this, finishArea);
        this.turnManager = turnManager;

        player.move_base(1, 0, true, function() {
            turnManager.start();
        });
    }
}