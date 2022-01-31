export default class Player extends Phaser.GameObjects.Sprite
{
  constructor(scene, index_x, index_y)
  {
    let spawn_point = scene.board.x_y_index_to_pixel(index_x, index_y);
    super(scene, spawn_point.x + 8, spawn_point.y + 4, 'player-idle');
    scene.player = this;

    this.scene = scene;
    this.didAction = false;
    this.createAnimations();

    this.setScale(1);
    this.play('idle');
  }

  createAnimations() {
    this.scene.anims.create({
        key: 'idle',
        frames: this.scene.anims.generateFrameNumbers('player-idle', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] }),
        frameRate: 12,
        repeat: -1
    });

    this.scene.anims.create({
        key: 'walk',
        frames: this.scene.anims.generateFrameNumbers('player-walk', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7] }),
        frameRate: 14,
        repeat: -1
    });
  }

  setActionAndVerify() {
      if (this.didAction) {
          console.log("Atenção! Jogador já fez sua ação esse turno, ignorando nova ação...")
          return false;
      }
      this.didAction = true;
      return true;
  }

  wait() {
    if (this.setActionAndVerify() == false) { return; }

    this.logAction("ficou esperando.")
  }

  look() {
    let paths = {
      top: this.canMove(new Phaser.Geom.Point(0,-1)),
      right: this.canMove(new Phaser.Geom.Point(1,0)),
      down: this.canMove(new Phaser.Geom.Point(0,1)),
      left: this.canMove(new Phaser.Geom.Point(-1,0)),
    };
    this.logAction("Olhou onde tem caminhos livres\n" + JSON.stringify(paths, null, 2));
    return paths;
  }

  canMove(point) {
    let position = this.currentPosition();
    let new_point = new Phaser.Geom.Point(position.x + point.x, position.y + point.y);

    let willBeCollision = this.scene.board.positionCollides(new_point);
    return willBeCollision == false;
  }

  currentPosition() {
    const player = this.scene.player;
    const playerPosition = new Phaser.Geom.Point(player.x, player.y);
    return this.scene.board.pixel_to_index(playerPosition);
  }

  move_base (x, y, silent = false, onComplete) {
    let direction = 'cima';
    if (x == 1) { direction = 'direita'; }
    if (x == -1) { direction = 'esquerda'; }
    if (y == 1) { direction = 'baixo'; }
    if (y == -1) { direction = 'cima'; }

    let point = new Phaser.Geom.Point(x, y);
    if (this.canMove(point) == false) {
      this.logAction('Tentou andar para ' + direction + ', mas está bloqueado');
      return false;
    }

    const player = this.scene.player;
    player.flipX = x < 0;
    var tween = this.scene.tweens.add({
        targets: player,
        x: player.x + (x * 16),
        y: player.y + (y * 16),
        ease: 'EaseIn',
        duration: 300 * (Math.abs(x) + Math.abs(y)),
        yoyo: false,
        repeat: false,
        onStart: function () {
          player.logAction('Andou para ' + direction, silent);
          player.play('walk');
        },
        onComplete: function () {
            player.play('idle');
            if (onComplete != undefined) {
                onComplete();
            }
        },
        onYoyo: function () { console.log('onYoyo'); console.log(arguments); },
        onRepeat: function () { console.log('onRepeat'); console.log(arguments); },
    });
    return true;
  }

  logAction (action, silent = false) {
    if (silent) { return; }
    console.log("Clóvis: " + action);
  }

  move () {
    if (this.setActionAndVerify() == false) { return; }

    this.move_base(1, 0);
  }

  moveUp () {
    if (this.setActionAndVerify() == false) { return; }

    this.move_base(0, -1);
  }

  moveDown () {
    if (this.setActionAndVerify() == false) { return; }

    this.move_base(0, 1);
  }

  moveRight () {
    if (this.setActionAndVerify() == false) { return; }

    this.move_base(1, 0);
  }

  moveLeft () {
    if (this.setActionAndVerify() == false) { return; }

    this.move_base(-1, 0);
  }

  resetTurn() {
    this.didAction = false;
  }
}
