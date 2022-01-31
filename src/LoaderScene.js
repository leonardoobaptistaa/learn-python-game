import GenericScene from './GenericScene.js';

export default class LoaderScene extends Phaser.Scene
{
    constructor ()
    {
        super('LoaderScene');

        this.currentScene = null;
        this.currentLevel = 0;
        globalThis.loader = this;

        this.configs = [

            { tiles: 'world_tileset-16px.png', map: 'world_tilemap.json', loader: this },
            { tiles: 'world_tileset-16px.png', map: 'world02.json', loader: this },

        ]
    }

    init (data) {
    }

    getConfig() {
        return this.configs[this.currentLevel];
    }

    preload () {
    }

    create () {
        if (this.currentScene == null) {
            this.addNewScene();
        }
    }

    nextScene() {
        if (this.currentScene != undefined) {
            this.scene.remove(this.currentScene);
        }
        this.currentLevel += 1;
        this.addNewScene();
    }

    restartScene() {
        this.scene.remove('scene' + this.currentLevel);
        this.addNewScene();
    }

    addNewScene() {
        let newSceneName = 'scene' + this.currentLevel;
        let newScene = new GenericScene(newSceneName, this);
        this.scene.add(newSceneName, newScene, false);
        this.currentScene = newScene;
        this.scene.start(newSceneName, this.getConfig());
    }
}
