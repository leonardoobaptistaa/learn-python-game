import GenericScene from './GenericScene.js';
import LoaderScene from './LoaderScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-window',
    pixelArt: true,
    roundPixels: true,
    scene: [
        LoaderScene //GenericScene
    ],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 } // Top down game, so no gravity
        }
    }
};

globalThis.game = new Phaser.Game(config);