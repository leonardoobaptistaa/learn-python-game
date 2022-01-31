export default class TurnManager
{
    constructor (scene, finishArea)
    {
        this.scene = scene;
        this.turnIndex = 0;
        this.finishArea = this.convertFinishArea(finishArea);
        this.hideErrorMessage();
    }

    convertFinishArea(finishArea) {
        return new Phaser.Geom.Rectangle(
            finishArea.x,
            finishArea.y,
            finishArea.width,
            finishArea.height);
    }

    start() {
        window.resetDebug();
        this.turnIndex = -1;
        this.getCode();
        this.instantiateUserCode();
        console.log("Codigo carregado")
        this.callNextTurnAfterDelay();
        console.log("Começando turnos...")
    }

    instantiateUserCode() {
        globalThis.play_turn = undefined;
        eval(__BRYTHON__.python_to_js(this.playerCode));
    }

    run() {
        if (this.gameShouldEnd()) {
            console.log("Parabéns, você conseguiu!")
            this.scene.onWin();
            return;
        }

        let error = false;
        try {
            //this.playerControl.play_turn(globalThis.player);
            console.log("<br/>Turno " + this.turnIndex );
            globalThis.play_turn(globalThis.player);
            // eval(__BRYTHON__.python_to_js(this.playerCode));
          // eval(__BRYTHON__.py2js("a = 1").to_js())
          // eval(this.playerCode);
        }
        catch(e) {
            console.log(e);
            error = true;
        }
        finally {
            if (error == false) {
                this.callNextTurnAfterDelay();
            }
            else {
                this.stopOnError();
            }
        }
    }

    callNextTurnAfterDelay() {
        this.scene.time.addEvent({
            delay: 1200,
            //delay: 200,
            callback: () => {
                this.nextTurn();
            }
        });
    }

    gameShouldEnd() {
        let player = this.scene.player;
        return Phaser.Geom.Rectangle.Contains(this.finishArea,
            player.x,
            player.y);
    }

    nextTurn() {
        this.turnIndex += 1;
        this.scene.player.resetTurn();
        this.run();
    }

    getCode() {
        //this.playerCode = "from browser import document, window\n";
        //this.playerCode += "player = window.player\n";
        //this.playerCode += "let turn = this.turnIndex;\n";
        this.playerCode = globalThis.editor.getValue();
        this.playerCode += "\n\nfrom browser import window\n"
        this.playerCode += "window.play_turn = PlayerControl().play_turn"

        //document.getElementById('source').value;
    }

    stopOnError() {
        this.showErrorMessage();
    }

    hideErrorMessage() {
        globalThis.document.getElementById('source-warning').style.display = 'none';
    }

    showErrorMessage() {
        globalThis.document.getElementById('source-warning').style.display = 'block';
    }

    setErrorMessage(message) {
        let textInfo = globalThis.document.getElementById('source-warning');
    }
}